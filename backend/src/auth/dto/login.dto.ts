import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";


export class LoginDto
{
    id: number;

    @IsNotEmpty()
    @IsString()
    nick: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('ES')
    phone: string;

    avatar: string;

    authentication: boolean;
}