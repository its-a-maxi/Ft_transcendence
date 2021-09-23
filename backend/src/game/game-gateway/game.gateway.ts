import { OnModuleInit } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Status } from 'src/users/user-service/models/status.enum';
import { UserI } from 'src/users/user-service/models/user.interface';
import { UsersService } from 'src/users/user-service/users.service';
import { GameEntity } from '../models/game.entity';
import { GameI } from '../models/game.interface';
import { UserSocketI } from '../models/user-socket.interface';
import { GameService } from '../service/game/game.service';

//let listUsers: number[] = []

@WebSocketGateway({
    path: "/game",
	cors: {
		origin: ['https://hoppscotch.io',
			'http://localhost:3000', 'http://localhost:4200']
	}
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{

	@WebSocketServer()
	server: Server;

    cont: number = 0

    listRooms: GameI[] = []

    listUsers: UserSocketI[] = []

	constructor(private userService: UsersService,
                private gameService: GameService) {}

    async onModuleInit()
    {
        this.listRooms = []
        this.listUsers = []
        await this.gameService.deleteAll()
    }

	async handleConnection(socket: Socket)
	{console.log("SOCKET: ", socket.handshake.query.gate)
        try
        {
            const token: any = socket.handshake.query.token
            const user: UserI = await this.userService.getUser(token)
            if (!user)
                return this.disconnect(socket)
            else
            {
                socket.data.user = user
                console.log("ENTRADA", this.listUsers)
                this.addUsers({userId: user.id, socketId: socket.id})
            }
            
        }
        catch
        {
            return this.disconnect(socket)
        }
	}

	async handleDisconnect(socket: Socket)
	{
		console.log("DISCONNECT")
		this.removeUser({userId: socket.data.user.id, socketId: socket.id})
		socket.disconnect();
	}

	private disconnect(socket: Socket)
	{
		socket.emit('Error', new UnauthorizedException())
		socket.disconnect()
	}

	private addUsers(userSocket: UserSocketI)
	{
        let check: boolean = false

        for (let user of this.listUsers)
        {
            if (user.userId === userSocket.userId)
                check = true
        }
        if (!check)
            this.listUsers.push(userSocket)
	}

	private removeUser(userSocket: UserSocketI)
	{
		let index = this.listUsers.indexOf(userSocket)

		if (index > -1)
			this.listUsers.splice(index, 1)
	}

	@SubscribeMessage('leaveUser')
	async onLeaveRoom(socket: Socket, roomId: number)
	{
        let userId: number = socket.data.user.id
		this.removeUser({userId, socketId: socket.id})
        let listAux: GameI[] = this.listRooms
        for (let room of listAux)
        {
            if (room && room.id === roomId)
            {
                let index: number = this.listRooms.indexOf(room)
                if (index > -1)
                    this.listRooms.splice(index, 1)
                await this.gameService.delete(room.id)
                this.server.to(room.socketList[1]).emit('listUsers', null)
                this.server.to(room.socketList[0]).emit('listUsers', null)
                break ;
            }
        }
        await this.userService.updateStatus(Status.online, userId)
		this.disconnect(socket)
	}

	@SubscribeMessage('joinUser')
  	async onJoinRoom(socket: Socket)
	{
		this.addUsers({userId: socket.data.user.id, socketId: socket.id})
  	}

	// @SubscribeMessage('destroyUsers')
	// async destroyUsers(socket: Socket)
	// {
	// 	let list: number[] = listUsers
	// 	for (let user of list)
	// 	{
	// 		listUsers.pop()
	// 	}
	// }

	@SubscribeMessage('findUsers')
	async handdleTest(socket: Socket)
	{
        let auxUsers: UserSocketI[] = this.listUsers
        for (let i = 0; i < this.listUsers.length; i++)
        {
            if (i != 0 && this.listUsers[i].userId !== this.listUsers[i - 1].userId)
            {
                const newGame: GameI = await this.gameService
                    .create({
                        playerOne: this.listUsers[i - 1].userId,
                        playerTwo: this.listUsers[i].userId,
                        socketList: [this.listUsers[i - 1].socketId, this.listUsers[i].socketId]
                    })
                this.listUsers.splice(i - 1, 2)
                this.listRooms.push(newGame)
                break ;
            }
        }
        
        for (let room of this.listRooms)
        {
            if (socket.id === room.socketList[0] || socket.id === room.socketList[1])
            {
                if (room.socketList.length === 2)
                {
                    this.server.to(room.socketList[0]).emit('listUsers', room)
                    this.server.to(room.socketList[1]).emit('listUsers', room)
                }
            }
        }
	}

    @SubscribeMessage('gameStatus')
    async gameStatus(socket: Socket)
    {
        let userId: number = socket.data.user.id
        await this.userService.updateStatus(Status.inGame, userId)
    }

	@SubscribeMessage('keyboard')
	handdleKeyboard(socket: Socket, data: any)
	{
		//console.log("ESTO ES DATA: ", data)
	}
}
