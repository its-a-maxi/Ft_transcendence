import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/models/connected-user/connected-user.entity';
import { ConnectedUserI } from 'src/chat/models/connected-user/connected-user.interface';
import { UserI } from 'src/users/user-service/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService
{
	constructor(@InjectRepository(ConnectedUserEntity)
	private readonly connectedUserRepository: Repository<ConnectedUserEntity>) { }

	async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI>
    {
        return await this.connectedUserRepository.save(this.connectedUserRepository.create(connectedUser))
    }

	async deleteSocket(socketId: string)
    {
        return await this.connectedUserRepository.delete({socketId})
    }

    async findByUser(user: UserI): Promise<ConnectedUserI[]>
    {
        return await this.connectedUserRepository.find({user})
    }

    async findAllUserConnected(): Promise<ConnectedUserI[]>
    {
       return await this.connectedUserRepository.find()
    }

    async findUserById(userId: number): Promise<ConnectedUserI>
    {
        return await this.connectedUserRepository.findOne({userId})
    }

    async deleteAll()
    {
        await this.connectedUserRepository
          .createQueryBuilder()
          .delete()
          .execute();
    }
}
