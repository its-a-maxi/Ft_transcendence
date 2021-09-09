import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomEntity } from 'src/chat/models/room/room.entity';
import { RoomI } from 'src/chat/models/room/room.interface';
import { UserEntity } from 'src/users/user-service/models/entities/users.entity';
import { UserI } from 'src/users/user-service/models/user.interface';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class RoomService
{
	constructor(@InjectRepository(RoomEntity)
	private readonly roomRepository: Repository<RoomEntity>) {}

	async createRoom(room: RoomI, creator: UserI): Promise<RoomEntity>
	{
		const newRoom: RoomI = await this.addCreatorToRoom(room, creator)
		newRoom.password = await bcrypt.hash(newRoom.password, 12);
		return await this.roomRepository.save(newRoom)
	}

	async getAllRooms(): Promise<RoomEntity[]>
	{
		return this.roomRepository.find();
	}

	async deleteAllRooms(rooms: RoomI[])
	{
		for(let room of rooms)
		{
			this.roomRepository.delete(room)
		}
	}

	private async addCreatorToRoom(room: RoomI, creator: UserI): Promise<RoomI>
	{
		if (!room.users)
			room.users = []
		room.users.push(creator)
		return room
	}

	async getRoom(roomId: number): Promise<RoomI>
	{
		return this.roomRepository.findOne(roomId, {
		  relations: ['users']
		});
	}

	async getRoomsForUsers(userId: number, options: IPaginationOptions): Promise<Pagination<RoomI>>
	{
		const query = this.roomRepository
			.createQueryBuilder('room')
			.leftJoin('room.users', 'users')
			.where('users.id = :userId', { userId })
			.leftJoinAndSelect('room.users', 'all_users')
			.orderBy('room.updated_at', 'DESC')

		return paginate(query, options)
	}
}
