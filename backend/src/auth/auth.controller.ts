import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginDto } from './dto';
import { enviroment } from "../../enviroment";
import axios from "axios";
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { verifyUser } from './strategies/auth.guard';
import { AuthService } from './auth.service';

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
        {
            return res.redirect("http://localhost:4200/register")
        }
        else
            return res.redirect("http://localhost:4200/home")
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
    @Post('userID')
    async userId(@Body() nick: string)
    {
        //console.log(nick)
        let aux: Number = 0;
        (await this.userService.getAllUsers())
        .map(res => {
            if (res.nick === nick)
            {
                console.log("dentro")
                aux = res.id
            }
            //console.log(aux)
            return aux
            
        })
        
        return aux
    }
}
