import { Controller, Get, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';

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
        return res.redirect('http://localhost:3000/callback')
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

}
