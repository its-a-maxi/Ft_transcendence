import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from 'src/auth/roles/enums/roles.enum';
import { Roles } from 'src/auth/roles/roles.decorator';
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

    // @Post()
    // @Roles(Role.Admin)
    // createUser(@Body() user: CreateUserDto)
    // {
    //     return this.userService.createUser(user)
    // }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto)
    {
        return dto
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string)
    {

    }
}
