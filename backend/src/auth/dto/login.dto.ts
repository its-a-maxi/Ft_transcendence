import { IsNotEmpty, IsString } from "class-validator";


export class LoginDto
{
    id: number;

    @IsNotEmpty()
    @IsString()
    nick: string;
}