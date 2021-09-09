import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/chat/models/messages/messages.entity';
import { MessageI } from 'src/chat/models/messages/messages.interface';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { RoomI } from 'src/chat/models/room/room.interface';

@Injectable()
export class MessageService
{
	constructor(@InjectRepository(MessageEntity)
	private readonly messageRepository: Repository<MessageEntity>) { }

	async create(message: MessageI): Promise<MessageI>
    {
        return this.messageRepository.save(this.messageRepository.create(message));
    }

    async findMessagesForRoom(room: RoomI, options: IPaginationOptions): Promise<Pagination<MessageI>>
    {
        const query = this.messageRepository
            .createQueryBuilder('message')
            .leftJoin('message.room', 'room')
            .where('room.id = :roomId', { roomId: room.id })
            .leftJoinAndSelect('message.user', 'user')
            .orderBy('message.created_at', 'DESC');

        return paginate(query, options);

    }
}
