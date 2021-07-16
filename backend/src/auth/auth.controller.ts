import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginDto } from './dto';
import { enviroment } from "../../enviroment";
import axios from "axios";

@Controller('auth')
export class AuthController {

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

    @Get('/callback')
    async callback(@Req() urlcode, @Res() res: Response)
    {
        const code = urlcode.query.code
        const token = await axios.post(`https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${enviroment.API_UID}&client_secret=${enviroment.SECRET}&code=${code}&redirect_uri=${enviroment.REDIRECT_URL}`)
        const access_token = token.data.access_token
        const about_me = await axios.get("https://api.intra.42.fr/v2/me", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        console.log(about_me.data.login)
        return res.redirect("http://localhost:4200/home")
    }

    @Get('/getcode')
    getcode(@Res() res: Response)
    {
        try {
            return res.redirect(`https://api.intra.42.fr/oauth/authorize?client_id=${enviroment.API_UID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&response_type=code`)
        }catch (err) {
            console.log(err)
        }
        
    }

}
