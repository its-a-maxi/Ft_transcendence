import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber } from "class-validator";


export class UpdateDto
{
    id: number;

    @IsNotEmpty()
    @IsString()
    nick: string;

    avatar: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsPhoneNumber('ES')
    phone: string;

    authentication: boolean;
}