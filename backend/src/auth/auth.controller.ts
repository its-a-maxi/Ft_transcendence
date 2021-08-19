import { Body, Controller, Get, Param, Post, Put, Req, Res,
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
import { Twilio } from "twilio";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import axios from 'axios';


const client = new Twilio(enviroment.ACOUNT_TWI, enviroment.TOKEN_TWI)

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
    @Post('2fa')
    async twoFactor(@Res() res: Response, @Req() req: Request)
    {
        const phone: string = req.body.phone

        // if (phone)
        // {
            
        //     await client.verify.services(enviroment.SMS_VER).verifications.create({
        //             to: phone,
        //             channel: 'sms'
        //     }).then(message => console.log(message)).catch(err => console.log(err))
        // }
        // else
        // {
        //     console.log("Wrong phone number!")
        //     res.send("Wrong phone number!")
        // }
    }

    @UseGuards(verifyUser)
    @Post('verify')
    async verifyCode(@Res() res: Response, @Req() req: Request)
    {
        const code = req.body.code
        const phone = req.body.phone_h
        // if (code && phone)
        // {
        //     await client.verify.services(enviroment.SMS_VER).verificationChecks.create({
        //         to: phone,
        //         code
        //     }).then(message => console.log(message)).catch(err => console.log(err))
        // }
        // else
        // {
        //     console.log("Wrong code number!")
        //     res.send("Wrong code number!")
        // }
    }

    @Put('updateUser')
    async updateUser(@Req() req: Request, @Body() user: UpdateDto)
    {
        user.avatar = req.body.avatar
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
