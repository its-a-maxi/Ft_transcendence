import { IsEmail, IsNumber, IsString } from "class-validator";


export class CreateUserDto
{

    @IsNumber()
    id: number;

    @IsString()
    login: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;
}