import { IsNotEmpty, IsString, IsEmail} from "class-validator";


export class CreateUserDto
{
    id: number;

    @IsNotEmpty()
    @IsString()
    nick: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    avatar?: string;

    authentication?: boolean;
}