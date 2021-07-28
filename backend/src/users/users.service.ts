import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos';
import { User } from './entities/users.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

    async getAllUsers(): Promise<User[]>
    {
        return await this.usersRepository.find()
    }

    async getUser(id:any): Promise<User>
    {
        return await this.usersRepository.findOne(id)
    }

    async createUser(user: LoginDto, clientID: number): Promise<User>
    {
        user.id = clientID
        user.nick = user.nick
        user.avatar = 'https://image.api.playstation.com/cdn/EP0102/NPEB00554_00/VdBGeflDDEoAO6W6xoiBP6DXTWIlxll8_160.png?w=960&h=960'
        const newUser = this.usersRepository.create(user)
        return await this.usersRepository.save(newUser)
    }

    async getUserId(id:number): Promise<number>
    {
        const user = await this.usersRepository.findOne(id)
        return user.id
    }
}
