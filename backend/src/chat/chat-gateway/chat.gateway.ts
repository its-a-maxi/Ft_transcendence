import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect,
		SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { UserI } from 'src/users/user-service/models/user.interface';
import { UsersService } from 'src/users/user-service/users.service';
import { ConnectedUserService } from '../chat-service/connected-user/connected-user.service';
import { JoinedRoomService } from '../chat-service/joined-room/joined-room.service';
import { MessageService } from '../chat-service/message/message.service';
import { RoomService } from '../chat-service/room/room.service';
import { ConnectedUserI } from '../models/connected-user/connected-user.interface';
import { JoinedRoomI } from '../models/joined-room/joined-room.interface';
import { MessageI } from '../models/messages/messages.interface';
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
				private messageService: MessageService) { }
	
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
				console.log("Esta conectado: ", user)
				const rooms = await this.roomService.getRoomsForUsers(user.id, { page: 1, limit: 10})
				await this.connectedUserService.create({socketId: socket.id, user})
				return this.server.to(socket.id).emit('rooms', rooms)
			}
		}
		catch
		{
			return this.disconnect(socket);
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
			const rooms = await this.roomService.getRoomsForUsers(user.id, { page: 1, limit: 10 });
			for (const connection of connections)
			{
				this.server.to(connection.socketId).emit('rooms', rooms);
			}
		}
	}

	@SubscribeMessage('joinRoom')
  	async onJoinRoom(socket: Socket, room: RoomI)
	{
		const messages = await this.messageService.findMessagesForRoom(room, { limit: 10, page: 1 });
		await this.joinedRoomService.create({ socketId: socket.id, user: socket.data.user, room });
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
		const createdMessage: MessageI = await this.messageService.create({...message, user: socket.data.user});
		const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
		const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(room);
		for(const user of joinedUsers)
		{
			this.server.to(user.socketId).emit('messageAdded', createdMessage);
			
		}
	}
}
