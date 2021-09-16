import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateUserDto } from "./create-users.dto";


export class UpdateUserDto extends PartialType(CreateUserDto)
{
    @IsOptional()
    login: string;

    @IsOptional()
    email: string;

    @IsOptional()
    password: string;

    @IsOptional()
    blackList?: string[];

    @IsBoolean()
    isAdmin?: boolean;
}