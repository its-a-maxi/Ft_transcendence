import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UpdateUserDto, CreateUserDto } from '../user-service/models/dtos';
import { UsersService } from '../user-service/users.service';


@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {}

    @Get()
    getAllUsers()
    {
        return this.userService.getAllUsers()
    }

    @Get(':id')
    getUser(@Param('id') id: number)
    {
        return this.userService.getUser(id)
    }
}
