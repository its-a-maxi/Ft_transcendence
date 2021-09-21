import { Body, Controller, ExecutionContext, Get, Param, Post, Put, Req, Res,
        UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginDto, UpdateDto } from '../dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/user-service/users.service';
import { verifyUser } from '../strategies/auth.guard';
import { AuthService } from '../auth-service/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { authenticator } from 'otplib'
import  QRCode  from "qrcode";
import { UserI } from 'src/users/user-service/models/user.interface';


@Controller('auth')
export class AuthController
{
    constructor(private jwtService: JwtService,
                private userService: UsersService,
                private authService: AuthService) {}

    @UseGuards(AuthGuard('oauth'))
    @Get('/callback')
    async callback(@Req() req, @Res({passthrough: true}) res: Response)
    {
        res.cookie('clientID', req.user, {httpOnly: true});
        const client = await this.jwtService.verifyAsync(req.user);
        const clientData = await this.userService.getUser(client['id']);

        if (!clientData)
        {
           try
            {
                const newUser = {
                    id: client['id'],
                    nick: client['loginName'],
                    email: client['userEmail']
                }
                const createdUser = await this.userService.customCreateUser(newUser)
                if (createdUser)
                    return res.redirect(`http://localhost:4200/mainPage/settings/${createdUser.id}`)
            }
            catch
            {
                return res.redirect("http://localhost:4200/landingPage/start")
            }
        }
        else if (clientData && clientData.authentication === true)
            return res.redirect("http://localhost:4200/twofa")
        else
            return res.redirect(`http://localhost:4200/mainPage/settings/${clientData.id}`)
    }

    @UseGuards(verifyUser)
    @Get('authUser')
    async authUser(@Req() req: Request)
    {
        const clientID = this.authService.clientID(req);
        return await this.userService.getUser(clientID); 
    }

    @UseGuards(verifyUser)
    @Post('storeUser')
    async storeUser(@Req() req: Request, @Body() user: LoginDto)
    {
        const clientID = await this.authService.clientID(req);
        return await this.userService.createUser(user, clientID)
    }

    @UseGuards(verifyUser)
    @Get('allUsers')
    async showUsers()
    {
        return this.userService.getAllUsers()
    }
    
    //@UseGuards(verifyUser)
    @Post('logout')
    async logOut(@Res({passthrough: true}) res: Response, @Req() req: Request)
    {
        const clientID = await this.authService.clientID(req);
        const user: UserI = await this.userService.getUser(clientID)
        user.status = 'offline'
        await this.userService.updateUser(user as UpdateDto, user.id)
        res.clearCookie('clientID')
        return {message: "User LogOut!"}
    }

    @UseGuards(verifyUser)
    @Get('2fa')
    async twoFactor(@Res() res: Response, @Req() req: Request)
    {
        const userID = await this.authService.clientID(req)
        const client = await this.userService.getUser(userID)
        const secret = authenticator.generateSecret()
        await this.userService.saveUserSecret(secret, userID)
        const optUrl = authenticator.keyuri(client.email, "FT_TRANSCENDENCE", secret)
        await QRCode.toFile('./assets/qrImage.png', optUrl)
        return res.send({url: 'http://localhost:3000/auth/assets/qrImage.png'})
    }

    @UseGuards(verifyUser)
    @Post('verify')
    async verifyCode(@Res() res: Response, @Req() req: Request)
    {
        const code = req.body.code
        const userID = await this.authService.clientID(req)
        const client = await this.userService.getUser(userID)
        const verify = authenticator.verify({token: code, secret: client.secret})
        if (!verify)
            throw new UnauthorizedException('Wrong authentication code');
        else
            return res.json({nick: client.nick})
    }

    @UseGuards(verifyUser)
    @Put('updateUser')
    async updateUser(@Req() req: Request, @Body() user: UpdateDto)
    {
        user.avatar = `http://localhost:3000/auth/assets/${req.body.avatar}`
        user.authentication = req.body.authentication
        const id = req.body.id
        return await this.userService.updateUser(user, id)
    }

    @UseGuards(verifyUser)
    @Post('image')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './assets',
            filename(_, file, callback) {
                return callback(null, `${file.originalname}`)
            }
        })
    }))
    updateAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request)
    {
        return {url: `http://localhost:3000/auth/assets/${file.originalname}`}
    }

    @Get('assets/:path')
    async storageImage(@Param('path') path: string, @Res() res: Response)
    {
        res.sendFile(path, {root: 'assets'})
    }

    @Get('getUserById/:id')
    async getUserById(@Param('id') userId: any, @Res() res: Response)
    {
        const clientID = await this.userService.getUser(userId)
        if (!clientID)
        {
            res.send("ERROR!!")
        }
        else
        {
            res.send(clientID)
        }
    }
}
