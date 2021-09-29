import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect,
		SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { UpdateDto } from 'src/auth/dto';
import { UserEntity } from 'src/users/user-service/models/entities/users.entity';
import { Status } from 'src/users/user-service/models/status.enum';
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


@WebSocketGateway({
    path: "/chat",
    cors: { origin: ['https://hoppscotch.io',
				'http://localhost:3000', 'http://localhost:4200'],
            credentials: true} })
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
	{//console.log("SOCKET: ", socket.handshake.query.gate)
		try
		{
			const token: any = socket.handshake.query.token
			const user: UserI = await this.userService.getUser(token)
			if (!user)
				this.disconnect(socket)
			else
			{
				socket.data.user = user
				await this.userService.updateStatus(Status.online, user.id)
				this.addUserRoom(user as UserEntity)
				this.addAdminRoom(user as UserEntity)
				const rooms = await this.roomService.findAllRoomById(user.id)
				//console.log(rooms);
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
					{
						room.users.unshift(newUser)
						await this.roomService.updateRoom(room)
					}
				}
			}
		}
	}

	private async addAdminRoom(newUser: UserEntity)
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
                    /*if (!room.admins)
                        room.admins = []
                    check = false
                    for (let user of room.admins)
                    {
                        if (user.id === newUser.id)
                            check = true
                    }*/
                    if (!check)
                    {
                        //room.admins.unshift(newUser)
                        await this.roomService.updateRoom(room)
                    }
				}
			}
		}
	}


	async handleDisconnect(socket: Socket)
	{
		const user: UserI = socket.data.user
		if (user)
			await this.userService.updateStatus(Status.offline, user.id)
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
		let user: UserI = socket.data.user;
		if (user)
		{
			user.isAdmin = true
			await this.userService.updateUser(user as UpdateDto, user.id)
		}
		const createdRoom: RoomI = await this.roomService.createRoom(room, user)
		for (const user of createdRoom.users)
		{
			const connections: ConnectedUserI[] = await this.connectedUserService.findByUser(user);
			const rooms: RoomEntity[] = await this.roomService.findAllRoomById(user.id)
			for (const connection of connections)
				this.server.to(connection.socketId).emit('rooms', rooms);
		}
	}

	@SubscribeMessage('findRooms')
	async findRooms(socket: Socket)
	{
		let id: number = socket.data.user.id
		const userConnected: ConnectedUserI[] = await this.connectedUserService.findAllUserConnected()
		
		for (let user of userConnected)
		{
			const rooms: RoomEntity[] = await this.roomService.findAllRoomById(user.userId)
			this.server.to(user.socketId).emit('rooms', rooms)
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
		await this.joinedRoomService.deleteBySocketId(socket.id);
	}

	@SubscribeMessage('addMessage')
	async onAddMessage(socket: Socket, message: MessageI)
	{
        console.log("ESTO ES MESSAGE: ", message)
		let check: boolean = false
		const currentUser: UserI = await this.userService.getUser(socket.data.user.id)
		let userBanned = await this.userService.getUser(currentUser.id)
		if (userBanned && userBanned.isBanned)
			return
		const createdMessage: MessageI = await this.messageService.create({...message, user: socket.data.user});
		const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room);

		for(const user of joinedUsers)
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

	@SubscribeMessage('deleteRoom')
	async removeRoom(socket: Socket, room: RoomI)
	{
		let listRoom: UserI[] = room.users
		for (let user of listRoom)
		{
			if (user.id === room.ownerId && user.isAdmin && room.option !== 'Direct')
			{
				let index: number = room.users.indexOf(user)
				if (listRoom[index + 1])
				{
					room.ownerId = room.users[index + 1].id
					room.users[index + 1].isAdmin = true
					await this.userService.updateUser(room.users[index + 1] as UpdateDto, room.users[index + 1].id)
				}
				else
				{
					room.ownerId = room.users[index - 1].id
					room.users[index - 1].isAdmin = true
					await this.userService.updateUser(room.users[index - 1] as UpdateDto, room.users[index - 1].id)
				}
				user.isAdmin = false
				await this.userService.updateUser(user as UpdateDto, user.id)
				await this.roomService.updateRoom(room)
				break
			}
		}
	}

	@SubscribeMessage('removeAllRoom')
	async removeAllRoom(socket: Socket, rooms: RoomI[])
	{
		await this.roomService.deleteAllRooms(rooms)
		this.server.emit('rooms', [])
	}

	@SubscribeMessage('usersConnected')
	async findUsersConnected(socket: Socket)
	{
		let listUsers: UserI[] = []
		const userConnected: ConnectedUserI[] = await this.connectedUserService.findAllUserConnected()
		for (let i = 0; i < userConnected.length; i++)
		{
			let user: UserI = await this.userService.getUser(userConnected[i].userId)
			listUsers.unshift(user)
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
		const user: UserI = await this.userService.getUser(parseInt(unblockUser))

		if (user.blackList && user.blackList.length > 0)
		{
			var index = user.blackList.indexOf(socket.data.user.id.toString());
			if (index > -1)
			{
				user.blackList.splice(index, 1);
				await this.userService.updateUser(user as UpdateDto, user.id)
			}
		}
	}

	@SubscribeMessage('userBanned')
	async userBanned(socket: Socket, user: UserI)
	{
		user.isBanned = true
		await this.userService.updateUser(user as UpdateDto, user.id)
		console.log("BBAAANNEED: ", user)
		setTimeout(() => {
			user.isBanned = false
			this.userService.updateUser(user as UpdateDto, user.id)
		}, 20000)
	}

	@SubscribeMessage('convertToAdmin')
	async convertToAdmin(socket: Socket, user: UserI)
	{
		user.isAdmin = true
		await this.userService.updateUser(user as UpdateDto, user.id)
	}

	@SubscribeMessage('typing')
	async typingMessage(socket: Socket)
	{
		socket.broadcast.emit('typing', `${socket.data.user.nick} is typing...`)
	}
}
