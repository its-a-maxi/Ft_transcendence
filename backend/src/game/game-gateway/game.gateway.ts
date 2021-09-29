import { OnModuleInit } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Status } from 'src/users/user-service/models/status.enum';
import { UserI } from 'src/users/user-service/models/user.interface';
import { UsersService } from 'src/users/user-service/users.service';
import { Ball } from '../classes/ball';
import { Paddle } from '../classes/paddle';
import { GameEntity } from '../models/game.entity';
import { GameI } from '../models/game.interface';
import { OptionGame } from '../models/option-gameRoom.enum';
import { UserSocketI } from '../models/user-socket.interface';
import { GameService } from '../service/game/game.service';

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

    ///////////////

    paddleWidth: number = 10;
	paddleHeight: number = 100;
    canvasHeight: number = 600;
    canvasWidth: number = 800;

    upArrowPressed: boolean = false;
	downArrowPressed: boolean = false;
	key_wPressed: boolean = false;
	key_sPressed: boolean = false;

	constructor(private userService: UsersService,
                private gameService: GameService) {}

    async onModuleInit()
    {
        this.listRooms = []
        this.listUsers = []
        await this.gameService.deleteAll()
    }

	async handleConnection(socket: Socket)
	{//console.log("SOCKET: ", socket.handshake.query.gate)
        try
        {
            const token: any = socket.handshake.query.token
            const user: UserI = await this.userService.getUser(token)
            if (!user)
                return this.disconnect(socket)
            else
            {
                socket.data.user = user
                //console.log("ENTRADA", this.listUsers)
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
						option: OptionGame.normal,
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

    @SubscribeMessage('showRooms')
    async showRooms(socket: Socket)
    {
        this.server.to(socket.id).emit('liveRooms', this.listRooms)
    }

	@SubscribeMessage('playDemo')
	async playDemo(socket: Socket)
	{
		const userId: number = socket.data.user.id
		const newGame: GameI = await this.gameService
            .create({
				playerOne: userId,
				playerTwo: -1,
				option: OptionGame.demo,
				socketList: [socket.id]
			})
		for (let user of this.listUsers)
		{
			if (user.socketId === socket.id)
			{
				let index = this.listUsers.indexOf(user)
				if (index > -1)
					this.listUsers.splice(index, 1)
			}
		}
		this.listRooms.push(newGame)
        await this.userService.updateStatus(Status.inGame, userId)
		this.server.to(socket.id).emit('roomDemo', newGame)
	}

    @SubscribeMessage('gameStatus')
    async gameStatus(socket: Socket)
    {
        let userId: number = socket.data.user.id
        await this.userService.updateStatus(Status.inGame, userId)
    }

	///////////////////////////////////////////////////////////////

    @SubscribeMessage('createGame')
    createGame(socket: Socket, game: GameI)
    {
        let plOne = new Paddle(10,  this.canvasHeight / 2 - this.paddleHeight / 2,
            0, game.playerOne, game.id)
        let plTwo = new Paddle(this.canvasWidth - (this.paddleWidth + 10),
            this.canvasHeight / 2 - this.paddleHeight / 2, 0, game.playerTwo, game.id)
        let ball = new Ball(this.canvasWidth / 2, this.canvasHeight / 2, 7, 5, 5)
		if (socket.id === game.socketList[0])
        	setInterval(() => this.update(plOne, plTwo, ball, game), 1000 / 60) 
        
    }

	private resetBallPos(ball: Ball)
	{
		ball.x = this.canvasWidth / 2;
		ball.y = this.canvasHeight / 2;
		ball.speed = 7;
		ball.velocityX = -ball.velocityX;
		ball.velocityY = -ball.velocityY;
		
	}

	private paddleCollision(paddle: Paddle, ball: Ball): boolean
	{
		let ballTop = ball.y - 7;
		let ballBottom = ball.y + 7;
		let ballRight = ball.x + 7;
		let ballLeft = ball.x - 7;

		let paddleTop = paddle.y;
		let paddleRight = paddle.x + this.paddleWidth;
		let paddleBottom = paddle.y + this.paddleHeight;
		let paddleLeft = paddle.x;

		return (ballLeft < paddleRight && ballTop < paddleBottom && ballRight > paddleLeft && ballBottom > paddleTop);
	}

    private update(plOne: Paddle, plTwo: Paddle, ball: Ball, game: GameI)
    {
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;

        if (this.key_wPressed && plOne.y > 0)
            plOne.y -= 10;
		else if (this.key_sPressed && (plOne.y < this.canvasHeight - this.paddleHeight))
            plOne.y += 10;
		if (game.option !== OptionGame.demo)
		{
			if (this.upArrowPressed && plTwo.y > 0)
				plTwo.y -= 10;
			else if (this.downArrowPressed && (plTwo.y < this.canvasHeight - this.paddleHeight))
				plTwo.y += 10;
		}

		if (ball.y + 7 >= this.canvasHeight || ball.y - 7 <= 0)
		{
			ball.velocityY = -ball.velocityY;
		}

		if (ball.x + 7 >= this.canvasWidth)
		{
			plOne.score += 1;
			this.resetBallPos(ball);
		}
		if (ball.x - 7 <= 0)
		{
			plTwo.score += 1;
			this.resetBallPos(ball);
		}

		let paddle: Paddle;
		if (ball.x <= this.canvasWidth / 2)
			paddle = plOne;
		else
			paddle = plTwo;
	
		if (this.paddleCollision(paddle, ball))
		{
			let angle = 0;
			if (ball.y < (paddle.y + this.paddleHeight / 2))
				angle = -(Math.PI / 4);
			else if (ball.y > (paddle.y + this.paddleHeight / 2))
				angle = Math.PI / 4;
			let dir = -1;
			if (paddle === plOne)
				dir = 1;
			ball.velocityX = dir * ball.speed * Math.cos(angle);
			ball.velocityY = ball.speed * Math.sin(angle);
			ball.speed += 0.2;
		}

		if (game.option === OptionGame.demo)
			plTwo.y += ((ball.y - (plTwo.y + this.paddleHeight / 2))) * 0.09; 
		let data = {
			plOne,
			plTwo,
			ball
		}
		if (plOne.score < 10 && plTwo.score < 10)
		{
			this.server.to(game.socketList[0]).emit('startGame', data)
			this.server.to(game.socketList[1]).emit('startGame', data)
		}
		else
		{
			this.server.to(game.socketList[0]).emit('startGame', "GameOver")
			this.server.to(game.socketList[1]).emit('startGame', "GameOver")
		}
		
    }

	@SubscribeMessage('keyboard')
	handdleKeyboard(socket: Socket, data: any)
	{
        this.upArrowPressed =  data.keyUp 
        this.downArrowPressed = data.keyDown
        this.key_wPressed = data.keyW
        this.key_sPressed = data.keyS
	}

}
