import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class LoginDto
{
    id: number;

    @IsNotEmpty()
    @IsString()
    nick: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    avatar: string;

    authentication: boolean;
}