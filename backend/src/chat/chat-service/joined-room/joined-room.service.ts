import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JoinedRoomEntity } from 'src/chat/models/joined-room/joined-room.entity';
import { JoinedRoomI } from 'src/chat/models/joined-room/joined-room.interface';
import { RoomI } from 'src/chat/models/room/room.interface';
import { UserI } from 'src/users/user-service/models/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomService
{
	constructor(@InjectRepository(JoinedRoomEntity)
	            private readonly joinedRoomRepository: Repository<JoinedRoomEntity>) {}

	async create(joinedRoom: JoinedRoomI): Promise<JoinedRoomI>
    { 
        return await this.joinedRoomRepository.save(joinedRoom);
    }

	async deleteBySocketId(socketId: string)
    {
        return await this.joinedRoomRepository.delete({ socketId });
    }

    async findByRoom(room: RoomI): Promise<JoinedRoomI[]>
    {
        return await this.joinedRoomRepository.find({ room });
    }

    async findByUser(user: UserI): Promise<JoinedRoomI[]>
    {
        return await this.joinedRoomRepository.find({ user });
    }

    async deleteAll()
    {
        await this.joinedRoomRepository
            .createQueryBuilder()
            .delete()
            .execute();
    }
}
