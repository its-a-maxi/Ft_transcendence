import { IsNotEmpty, IsString } from "class-validator";


export class UpdateDto
{
    id: number;

    @IsNotEmpty()
    @IsString()
    nick: string;

    avatar: string;
}