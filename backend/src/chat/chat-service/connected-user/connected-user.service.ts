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
        return this.connectedUserRepository.save(connectedUser)
    }

	async deleteSocket(socketId: string)
    {
        return this.connectedUserRepository.delete({socketId})
    }

    async findByUser(user: UserI): Promise<ConnectedUserI[]>
    {
        return this.connectedUserRepository.find({user})
    }

    async deleteAll()
    {
        await this.connectedUserRepository
          .createQueryBuilder()
          .delete()
          .execute();
    }
}
