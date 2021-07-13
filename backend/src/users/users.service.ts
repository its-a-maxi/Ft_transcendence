import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async getUser(id: number): Promise<User>
    {
        return await this.usersRepository.findOne(id)
    }

    async createUser(user: CreateUserDto): Promise<User>
    {
        const newUser = this.usersRepository.create(user)
        return await this.usersRepository.save(newUser)
    }
}
