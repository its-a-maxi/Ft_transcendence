import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto, UpdateDto } from 'src/auth/dto';
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
        user.email = user.email
        user.phone = user.phone
        user.avatar = 'http://localhost:3000/auth/assets/ryu.jpg'
        user.authentication = false
        const newUser = this.usersRepository.create(user)
        return await this.usersRepository.save(newUser)
    }

    async getUserId(id:number): Promise<number>
    {
        const user = await this.usersRepository.findOne(id)
        return user.id
    }

    async updateUser(user: UpdateDto, clientID: number)//: Promise<User>
    {
        user.avatar = `http://localhost:3000/auth/assets/${user.avatar}`
        return await this.usersRepository.update(clientID, user)
    }

    async saveUserSecret(secret: string, clientID: number): Promise<any> {
        return this.usersRepository.update(clientID, { secret });
      }
}
