import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect,
		SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { UpdateDto } from 'src/auth/dto';
import { UserEntity } from 'src/users/user-service/models/entities/users.entity';
import { UserI } from 'src/users/user-service/models/user.interface';
import { UsersService } from 'src/users/user-service/users.service';
import { ConnectedUserService } from '../chat-service/connected-user/connected-user.service';
import { JoinedRoomService } from '../chat-service/joined-room/joined-room.service';
import { MessageService } from '../chat-service/message/message.service';
import { RoomService } from '../chat-service/room/room.service';
import { ConnectedUserI } from '../models/connected-user/connected-user.interface';
import { JoinedRoomI } from '../models/joined-room/joined-room.interface';
import { MessageI } from '../models/messages/messages.interface';
import { RoomEntity } from '../models/room/room.entity';
import { RoomI } from '../models/room/room.interface';


@WebSocketGateway({ cors: { origin: ['https://hoppscotch.io',
				'http://localhost:3000', 'http://localhost:4200'] } })
export class ChatGateway
		implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{

	@WebSocketServer()
	server: Server;
	listRooms: RoomI[] = []

	constructor(private roomService: RoomService,
				private userService: UsersService,
				private connectedUserService: ConnectedUserService,
				private joinedRoomService: JoinedRoomService,
				private messageService: MessageService,
				) { }
	
	async onModuleInit()
	{
		await this.connectedUserService.deleteAll()
		await this.joinedRoomService.deleteAll()
	}

	async handleConnection(socket: Socket)
	{
		try
		{
			const token: any = socket.handshake.query.token
			const user: UserI = await this.userService.getUser(token)
			if (!user)
				this.disconnect(socket)
			else
			{
				socket.data.user = user
				this.addUserRoom(user as UserEntity)
				const rooms = await this.roomService.findAllRoomById(user.id)
				await this.connectedUserService.create({socketId: socket.id, userId: user.id, user})
				return this.server.to(socket.id).emit('rooms', rooms)
			}
		}
		catch
		{
			return this.disconnect(socket);
		}
	}

	private async addUserRoom(newUser: UserEntity)
	{
		let check: boolean = false
		const connected: ConnectedUserI[] = await this.connectedUserService.findAllUserConnected()

		if (connected.length > 0)
		{
			const userRooms = await this.roomService.queryRooms()

			for (let room of userRooms)
			{
				if (room.option !== 'Direct')
				{
					check = false
					for (let user of room.users)
					{
						if (user.id === newUser.id)
							check = true
					}
					if (!check)
						room.users.push(newUser)
				}
			}
		}
	}

	async handleDisconnect(socket: Socket)
	{
		await this.connectedUserService.deleteSocket(socket.id)
		socket.disconnect();
	}

	private disconnect(socket: Socket)
	{
		socket.emit('Error', new UnauthorizedException())
		socket.disconnect()
	}

	@SubscribeMessage('createRoom')
	async onCreateRoom(socket: Socket, room: RoomI)
	{
		const createdRoom: RoomI = await this.roomService.createRoom(room, socket.data.user)

		for (const user of createdRoom.users)
		{
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms = await this.roomService.findAllRoomById(user.id)
			for (const connection of connections)
				this.server.to(connection.socketId).emit('rooms', rooms);
		}
	}

	@SubscribeMessage('joinRoom')
  	async onJoinRoom(socket: Socket, room: RoomI)
	{
		const messages = await this.messageService.findMessagesForRoom(room, { limit: 10, page: 1 });
		await this.joinedRoomService.create({
			socketId: socket.id,
			userId: socket.data.user.id,
			user: socket.data.user,
			room });
		this.server.to(socket.id).emit('messages', messages);
  	}

	@SubscribeMessage('leaveRoom')
	async onLeaveRoom(socket: Socket)
	{
		console.log("LEAVE ROOM: ", socket.data.user.nick)
		await this.joinedRoomService.deleteBySocketId(socket.id);
	}

	@SubscribeMessage('addMessage')
	async onAddMessage(socket: Socket, message: MessageI)
	{
		let check: boolean = false
		const currentUser: UserI = await this.userService.getUser(socket.data.user.id)
		const createdMessage: MessageI = await this.messageService.create({...message, user: socket.data.user});
		const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room);
		for(const user of joinedUsers)
		{
			let userBanned = await this.userService.getUser(user.userId)
			if (userBanned && userBanned.isBanned === false)
			{
				check = false
				if (currentUser.blackList && currentUser.blackList.length > 0)
				{
					for (let i of currentUser.blackList)
					{
						if (i == user.userId.toString())
							check = true
					}
				}
				if (!check)
					this.server.to(user.socketId).emit('messageAdded', createdMessage);
			}
		}
	}

	@SubscribeMessage('deleteRoom')
	async removeRoom(socket: Socket, room: RoomI)
	{
		if (room && room.option === 'Direct')
			await this.roomService.removeRoom(room)
		this.server.to(socket.id).emit('leaveRoom')
	}

	@SubscribeMessage('removeAllRoom')
	async removeAllRoom(socket: Socket, rooms: RoomI[])
	{
		const roomsDeleted = await this.roomService.deleteAllRooms(rooms)
		const userConnected: ConnectedUserI[] = await this.connectedUserService.findAllUserConnected()
		for (let user of userConnected)
			this.server.to(user.socketId).emit('rooms', roomsDeleted)
	}

	@SubscribeMessage('usersConnected')
	async findUsersConnected(socket: Socket)
	{
		let listUsers: UserI[] = []
		const userConnected: ConnectedUserI[] = await this.connectedUserService.findAllUserConnected()
		for (let i = 0; i < userConnected.length; i++)
		{
			let user: UserI = await this.userService.getUser(userConnected[i].userId)
			listUsers.push(user)
		}
		this.server.emit('connectedUsers', listUsers)
	}

	@SubscribeMessage('blockUser')
	async blockUser(socket: Socket, blockUser: string)
	{
		let check: boolean = false
		let userId: number = parseInt(blockUser)
		let blockId: string = socket.data.user.id.toString()
		const user: UserI = await this.userService.getUser(userId)

		if (user.blackList && user.blackList.length > 0)
			check = user.blackList.includes(blockId)
		else if (!user.blackList)
			user.blackList = []
		if (!check)
		{
			user.blackList.push(blockId)
			await this.userService.updateUser(user as UpdateDto, userId)
		}		
	}

	@SubscribeMessage('UnblockUser')
	async unblockUser(socket: Socket, unblockUser: string)
	{
		const user: UserI = await this.userService.getUser(socket.data.user.id)

		if (user.blackList && user.blackList.length > 0)
		{
			var index = user.blackList.indexOf(unblockUser);
			if (index > -1)
			{
				user.blackList.splice(index, 1);
				await this.userService.updateUser(user as UpdateDto, socket.data.user.id)
			}
		}
	}

	@SubscribeMessage('userBanned')
	async userBanned(socket: Socket, user: UserI)
	{
		const userConnected: ConnectedUserI = await this.connectedUserService.findUserById(user.id)
		user.isBanned = true
		await this.userService.updateUser(user as UpdateDto, user.id)
		setTimeout(() => {
			user.isBanned = false
			this.userService.updateUser(user as UpdateDto, user.id)
		}, 10000)
	}
}
