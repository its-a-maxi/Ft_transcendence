import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserI } from "src/users/user-service/models/user.interface";

export class RoomDto
{

    @IsNumber()
    ownerId?: number;

    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    password?: string;

    @IsString()
    @IsNotEmpty()
    option?: string;
}