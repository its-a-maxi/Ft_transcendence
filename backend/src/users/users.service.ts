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
        const newUser = this.usersRepository.create(user)
        return await this.usersRepository.save(newUser)
    }
}
