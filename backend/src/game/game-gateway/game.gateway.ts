import { UnauthorizedException } from '@nestjs/common/exceptions';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserI } from 'src/users/user-service/models/user.interface';
import { UsersService } from 'src/users/user-service/users.service';
import { GameEntity } from '../models/game.entity';
import { GameI } from '../models/game.interface';
import { GameService } from '../service/game/game.service';

let listUsers: number[] = []

@WebSocketGateway({
	cors: {
		origin: ['https://hoppscotch.io',
			'http://localhost:3000', 'http://localhost:4200']
	}
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect
{

	@WebSocketServer()
	server: Server;

    cont: number = 0

    listRooms: GameI[] = []

	//listUsers: UserI[] = []

	constructor(private userService: UsersService,
                private gameService: GameService) {}

	async handleConnection(socket: Socket)
	{
		try
		{
			const token: any = socket.handshake.query.token
			const user: UserI = await this.userService.getUser(token)
			if (!user)
				return this.disconnect(socket)
			else
			{
				socket.data.user = user
				console.log("ENTRADA", listUsers)
				this.addUsers(socket, user)
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
		this.removeUser(socket)
		socket.disconnect();
	}

	private disconnect(socket: Socket)
	{
		socket.emit('Error', new UnauthorizedException())
		socket.disconnect()
	}

	private addUsers(socket: Socket, user: UserI)
	{
		let index = listUsers.indexOf(user.id)
		if (index === -1)
		{
			listUsers.push(user.id)
            this.cont++
		}
	}

	private removeUser(socket: Socket)
	{
		let index = listUsers.indexOf(socket.data.user.id)
		if (index > -1)
		{
			listUsers.splice(index, 1)
            this.cont--
		}
	}

	@SubscribeMessage('leaveUser')
	async onLeaveRoom(socket: Socket, roomId: number)
	{
		this.removeUser(socket)
        let listAux: GameI[] = this.listRooms
        
        for (let room of listAux)
        {
            if (room && room.id === roomId)
            {
                let index = this.listRooms.indexOf(room)
                if (index > -1)
                    this.listRooms.splice(index, 1)
                await this.gameService.delete(room.id)
            }
        }
		this.disconnect(socket)
	}

	@SubscribeMessage('joinUser')
  	async onJoinRoom(socket: Socket)
	{
		this.addUsers(socket, socket.data.user)
  	}

	@SubscribeMessage('destroyUsers')
	async destroyUsers(socket: Socket)
	{
		let list: number[] = listUsers
		for (let user of list)
		{
			listUsers.pop()
		}
	}

	@SubscribeMessage('findUsers')
	async handdleTest(socket: Socket)
	{
        if (listUsers[1])
        { 
            const newGame: GameEntity = await this.gameService.create({playerOne: listUsers[0], playerTwo: listUsers[1]})
            console.log(newGame.id)
            listUsers.splice(0, 2)
            this.listRooms.push(newGame)

        }
        if (this.listRooms)
        {
            socket.emit('listUsers', this.listRooms[0])
        }
        
	}

	@SubscribeMessage('keyboard')
	handdleKeyboard(socket: Socket, data: any)
	{
		//console.log("ESTO ES DATA: ", data)
	}
}
