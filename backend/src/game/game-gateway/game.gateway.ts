import { UnauthorizedException } from '@nestjs/common/exceptions';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserI } from 'src/users/user-service/models/user.interface';
import { UsersService } from 'src/users/user-service/users.service';

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

	constructor(private userService: UsersService) {}

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
			}
			
		}
		catch
		{
			return this.disconnect(socket)
		}
		
	}

	async handleDisconnect(socket: Socket)
	{
		socket.disconnect();
	}

	private disconnect(socket: Socket)
	{
		socket.emit('Error', new UnauthorizedException())
		socket.disconnect()
	}

	// @SubscribeMessage('game')
	// handleMessage(client: any, payload: any): string {
	// 	return 'Hello world!';
	// }

	@SubscribeMessage('gameTest')
	handdleTest(socket: Socket, mess: string)
	{
		this.server.emit('game', mess)
	}

	@SubscribeMessage('keyboard')
	handdleKeyboard(socket: Socket, data: any)
	{
		console.log("ESTO ES DATA: ", data)
	}
}
