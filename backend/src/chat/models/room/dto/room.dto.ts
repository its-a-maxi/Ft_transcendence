import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RoomDto
{
    @IsNumber()
    ownerId: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    option: string;
}