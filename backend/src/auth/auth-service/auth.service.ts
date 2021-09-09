import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';


@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService) {}

    async clientID(request: Request): Promise<number>
    {
        const cookie = request.cookies['clientID'];
        const data = await this.jwtService.verifyAsync(cookie);
        
        return data['id'];
    }

    verifyToken(jwt: string): Promise<any>
    {
        return this.jwtService.verifyAsync(jwt)
    }

}
