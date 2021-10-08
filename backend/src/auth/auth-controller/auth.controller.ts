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
import { Observable, from, of } from 'rxjs';


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
            return res.redirect(`http://localhost:4200/landingPage/twoFaCheck/${clientData.id}`)
        else
            return res.redirect(`http://localhost:4200/mainPage/settings/${clientData.id}`)
    }

    // @UseGuards(verifyUser)
    // @Post('/refresh')
    // async refreshToken(@Req() req: any, @Res() res: Response)
    // {
    //     const decoded: any = this.jwtService.decode(req.cookies['clientID'])
    //     const dateTime = new Date().getTime();
    //     const timestamp = Math.floor(dateTime / 1000);
    //     const token_iat = decoded.iat
    //     const time: number = Math.round((timestamp - token_iat) / 60)
    //     if (time < 120 && time > 30)
    //     {
    //         const jwt = await this.jwtService.signAsync({
    //             id: decoded.id,
    //             loginName: decoded.login,
    //             userEmail: decoded.email
    //         })
    //         res.cookie('clientID', jwt, {httpOnly: false});
    //         return res.send({message: 'refresh token!'})
    //     }
        
    // }

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
        
        return await this.userService.getAllUsers()
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
    @Post('createQR')
    async createQR(@Res() res: Response, @Req() req: Request, @Body() data: any)
    {
        const client = await this.userService.getUser(data.userId)
        const secret = authenticator.generateSecret()

        await this.userService.saveUserSecret(secret, client.id)
        const optUrl = authenticator.keyuri(client.email, "FT_TRANSCENDENCE", secret)
        await QRCode.toFile('./assets/qrImage.png', optUrl)
        return res.json({nick: client.id})
    }   

    // @UseGuards(verifyUser)
    // @Get('2fa')
    // async twoFactor(@Res() res: Response, @Req() req: Request, @Body() data: any)
    // {
    //     // const userID = await this.authService.clientID(req)
    //     // const client = await this.userService.getUser(userID)
    //     // console.log("LLEGA: ", client, "DATA", data)
    //     // const secret = authenticator.generateSecret()

    //     // //if (!client.secret)
    //     // //{
    //     //     await this.userService.saveUserSecret(secret, userID)
    //     //     const optUrl = authenticator.keyuri(client.email, "FT_TRANSCENDENCE", secret)
    //     //     await QRCode.toFile('./assets/qrImage.png', optUrl)
    //     // //}
    //     console.log("LLEGAGAAAAAAA")
    //     return res.send({url: 'http://localhost:3000/auth/assets/qrImage.png'})
    // }

    @UseGuards(verifyUser)
    @Post('verify')
    async verifyCode(@Res() res: Response, @Req() req: Request, @Body() data: any)
    {
        const code = data.num.code
        const client = await this.userService.getUser(data.userId)
        const verify = authenticator.verify({token: code, secret: client.secret})

        if (!verify)
        {
            throw new UnauthorizedException('Wrong authentication code');
        }
        else
        {
            return res.json({nick: client.id})
        }
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

    @UseGuards(verifyUser)
    @Put('updateFriends')
    async updateFriends(@Req() req: Request,  @Res() res: Response, @Body() params: any)
    {
        try
        {
            const id = req.body.id
            const user: UserI = await this.userService.getUser(params.id)
            user.friendsId = [];
            for (let i = 0; params.friends[i]; i++)
                user.friendsId.push(params.friends[i].id);
            await this.userService.updateFriends(user)
            return res.status(200).send("OK")
        }
        catch
        {
            return res.status(400)
        }
    }

    @UseGuards(verifyUser)
    @Put('addMatch')
    async addMatch(@Req() req: Request,  @Res() res: Response, @Body() params: any)
    {
        try
        {
            if (params.id == '-1')
                return res.status(200).send("OK")
            const id = req.body.id
            const user: UserI = await this.userService.getUser(params.id)
            if (!user.matches)
                user.matches = [];
            user.matches.push(params.match);
            console.log(params);
            await this.userService.updateFriends(user)
            return res.status(200).send("OK")
        }
        catch
        {
            return res.status(400)
        }
    }
}
