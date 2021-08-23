import { Body, Controller, Get, Param, Post, Put, Req, Res,
        UnauthorizedException,
        UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginDto, UpdateDto } from './dto';
import { enviroment } from "../../enviroment";
import path from 'path'
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { verifyUser } from './strategies/auth.guard';
import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { authenticator } from 'otplib'
import  QRCode  from "qrcode";
import axios from 'axios';


@Controller('auth')
export class AuthController
{
    constructor(private jwtService: JwtService,
                private userService: UsersService,
                private authService: AuthService) {}

    @Get('login')
    login()
    {
        return ;
    }

    @Get('redirect')
    redirect(@Res() res: Response)
    {
        return res.redirect('http://localhost:3000/auth/callback')
    }

    @Get('status')
    status(@Req() req: Request)
    {
        return req.user
    }

    @Get('logout')
    logout(@Req() req: Request)
    {
        return req.logOut()
    }

    @UseGuards(AuthGuard('oauth'))
    @Get('/callback')
    async callback(@Req() req, @Res({passthrough: true}) res: Response)
    {
        res.cookie('clientID', req.user, {httpOnly: true});
        const client = await this.jwtService.verifyAsync(req.user);

        const clientData = await this.userService.getUser(client['id']);

        if (!clientData)
            return res.redirect("http://localhost:4200/register")
        else if (clientData && clientData.authentication === true)
            return res.redirect("http://localhost:4200/twofa")
        else
            return res.redirect("http://localhost:4200/profile")
    }

    @UseGuards(verifyUser)
    @Get('authUser')
    authUser(@Req() req: Request)
    {
        const clientID = this.authService.clientID(req);
        return this.userService.getUser(clientID); 
    }

    @UseGuards(verifyUser)
    @Post('storeUser')
    async storeUser(@Req() req: Request, @Body() user: LoginDto)
    {
        const clientID = await this.authService.clientID(req);
        return this.userService.createUser(user, clientID)
    }

    @UseGuards(verifyUser)
    @Get('allUsers')
    async showUsers()
    {
        return this.userService.getAllUsers()
    }
    
    @UseGuards(verifyUser)
    @Post('logout')
    async logOut(@Res({passthrough: true}) res: Response)
    {
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

    //@UseGuards(verifyUser)
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
        user.avatar = req.body.avatar
        user.authentication = req.body.authentication
        const clientID = await this.authService.clientID(req);
        return await this.userService.updateUser(user, clientID)
    }

    //@UseGuards(verifyUser)
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
}
