import { IsNotEmpty, IsString, IsEmail} from "class-validator";


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

    authentication: boolean;
}