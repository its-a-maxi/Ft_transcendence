import { OnModuleInit } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomI } from 'src/chat/models/room/room.interface';
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

    listPowerUp: string[] = []

    listRooms: GameI[] = []

    normalUsers: UserSocketI[] = []

    liveShowUsers: UserSocketI[] = []

    specialUsers: UserSocketI[] = []

    leaveUsers: UserSocketI[] = []

    ///////////////

    paddleWidth: number = 10;
	paddleHeight: number = 100;
    canvasHeight: number = 600;
    canvasWidth: number = 800;

    upArrowPressed: boolean = false;
	downArrowPressed: boolean = false;
	key_wPressed: boolean = false;
	key_sPressed: boolean = false;

    /*POWERUPS*/
    PowerUpx2: boolean = false
    PowerUpQuickBall: number = 0
    PowerUpOnePoint: boolean = false
    PowerUpQuickPalette: number = 8

	constructor(private userService: UsersService,
                private gameService: GameService) {}

    async onModuleInit()
    {
        this.listRooms = []
        this.normalUsers = []
        this.specialUsers = []
        this.liveShowUsers = []
        this.leaveUsers = []
        await this.gameService.deleteAll()
    }

	async handleConnection(socket: Socket)
	{
        try
        {
            const token: any = socket.handshake.query.token
            const user: UserI = await this.userService.getUser(token)
            if (!user)
                return this.disconnect(socket)
            else
                socket.data.user = user
            
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

	private removeUser(userSocket: UserSocketI)
	{
		let index = this.normalUsers.indexOf(userSocket)

		if (index > -1)
			this.normalUsers.splice(index, 1)

        index = this.specialUsers.indexOf(userSocket)
        if (index > -1)
            this.specialUsers.splice(index, 1)
	}

    private sendRooms(socket: Socket)
    {
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
        if (this.listPowerUp.length === 2)
            for (let i = 0; i <= this.listPowerUp.length; i++)
                this.listPowerUp.pop()
    }

    @SubscribeMessage('addLiveUsers')
    addLiveUsers(socket: Socket)
    {
        let liveUser: UserSocketI = {
            userId: socket.data.user.id,
            socketId: socket.id
        }
        this.liveShowUsers.push(liveUser)
    }

    @SubscribeMessage('removeLiveUsers')
    removeLiveUsers(socket: Socket)
    {
        for (let user of this.liveShowUsers)
        {
            if (user.socketId === socket.id)
            {
                let index: number = this.liveShowUsers.indexOf(user);
                if (index > -1)
                    this.liveShowUsers.splice(index, 1);
            }
        }
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

	@SubscribeMessage('findUsers')
	async findUsers(socket: Socket)
	{
        this.normalUsers.push({userId: socket.data.user.id, socketId: socket.id})
        for (let i = 0; i < this.normalUsers.length; i++)
        {
            if (i != 0 && this.normalUsers[i].userId !== this.normalUsers[i - 1].userId)
            {
                const newGame: GameI = await this.gameService
                    .create({
                        playerOne: this.normalUsers[i - 1].userId,
                        playerTwo: this.normalUsers[i].userId,
                        option: OptionGame.normal,
                        socketList: [this.normalUsers[i - 1].socketId, this.normalUsers[i].socketId]
                    })
                this.normalUsers.splice(i - 1, 2)
                this.listRooms.push(newGame)
                break ;
            }
        }
        this.sendRooms(socket)
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

    private checkPowerUps(game: GameI)
    {
        this.PowerUpQuickBall = 0;
        this.PowerUpx2 = false
        this.PowerUpOnePoint = false
        this.PowerUpQuickPalette= 8
        if (game.powerList)
        {
            for (let power of game.powerList)
            {
                if (power === 'PowerUpx2')
                    this.PowerUpx2 = true
                if (power === 'PowerUpBigPalette')
                {
                    this.paddleHeight = 200;
                    this.paddleWidth = 20;
                }
                if (power === 'PowerUpQuickBall')
                    this.PowerUpQuickBall = 1;
                if (power === 'PowerUpOnePoint')
                    this.PowerUpOnePoint = true;
                if (power === 'PowerUpQuickPalette')
                    this.PowerUpQuickPalette = 16;
            }
        }
    }

    @SubscribeMessage('createGame')
    createGame(socket: Socket, game: GameI)
    {
        this.checkPowerUps(game)
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

		return (ballLeft < paddleRight && ballTop < paddleBottom &&
            ballRight > paddleLeft && ballBottom > paddleTop);
	}

    private update(plOne: Paddle, plTwo: Paddle, ball: Ball, game: GameI)
    {
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;

        if (this.key_wPressed && plOne.y > 0)
            plOne.y -= this.PowerUpQuickPalette;
		else if (this.key_sPressed &&
            (plOne.y < this.canvasHeight - this.paddleHeight))
            plOne.y += this.PowerUpQuickPalette;
		if (game.playerTwo !== -1)
		{
			if (this.upArrowPressed && plTwo.y > 0)
				plTwo.y -= this.PowerUpQuickPalette;
			else if (this.downArrowPressed &&
                (plTwo.y < this.canvasHeight - this.paddleHeight))
				plTwo.y += this.PowerUpQuickPalette;
		}

		if (ball.y + 7 >= this.canvasHeight || ball.y - 7 <= 0)
		{
			ball.velocityY = -ball.velocityY;
		}
		if (ball.x + 7 >= this.canvasWidth)
		{
			plOne.score += 1;
            if (this.PowerUpx2)
                plOne.score += 1;
            if (this.PowerUpOnePoint)
                plOne.score += 9;
			this.resetBallPos(ball);
		}
		if (ball.x - 7 <= 0)
		{
			plTwo.score += 1;
            if (this.PowerUpx2)
                plTwo.score += 1;
            if (this.PowerUpOnePoint)
                plTwo.score += 9;
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
            ball.speed += this.PowerUpQuickBall
		}

		if (game.playerTwo === -1)
			plTwo.y += ((ball.y - (plTwo.y + this.paddleHeight / 2))) * 0.09; 
		let data = {
			plOne,
			plTwo,
			ball,
            roomId: game.id
		}
		if (plOne.score < 10 && plTwo.score < 10)
		{
            this.server.to(game.socketList[0]).emit('startGame', data)
            this.server.to(game.socketList[1]).emit('startGame', data)
            for (let user of this.liveShowUsers)
                this.server.to(user.socketId).emit('startGame', data)
		}
		else
        {
            let winner: number = (plOne.score > plTwo.score) ?  plOne.player : plTwo.player;
            let losser: number = (plOne.score > plTwo.score) ?  plTwo.player : plOne.player;
            let message = {
                text: "GameOver",
                winner,
                losser
            }
            this.server.to(game.socketList[0]).emit('startGame', message)
            this.server.to(game.socketList[1]).emit('startGame', message)
            for (let user of this.liveShowUsers)
                this.server.to(user.socketId).emit('startGame', message)
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

    @SubscribeMessage('updateStats')
    async updateStats(socket: Socket, data: any)
    {
       if (data.winner !== -1 && data.losser !== -1)
       {
           const userOne: UserI = await this.userService.getUser(data.winner)
           const userTwo: UserI = await this.userService.getUser(data.losser)
           if (userOne.id === data.winner)
           {
                userOne.wins += 1;
                await this.userService.updateWins(userOne.wins, userOne.id)
           }
           else if (userOne.id === data.losser)
           {
                userOne.defeats += 1;
                await this.userService.updateDefeats(userOne.defeats, userOne.id)
           }
           if (userTwo.id === data.winner)
           {
                userTwo.wins += 1;
                await this.userService.updateWins(userTwo.wins, userTwo.id)
           }
           else if (userTwo.id === data.losser)
           {
                userTwo.defeats += 1;
                await this.userService.updateDefeats(userTwo.defeats, userTwo.id)
           }
       }
    }

    @SubscribeMessage('createSpecialRooms')
    async createSpecialRooms(socket: Socket, option: any)
    {
        this.specialUsers.push({userId: socket.data.user.id, socketId: socket.id})
        this.listPowerUp.push(Object.keys(option).toString())
        
        for (let i = 0; i < this.specialUsers.length; i++)
        {
            if (i != 0 && this.specialUsers[i].userId !== this.specialUsers[i - 1].userId)
            {
                const newGame: GameI = await this.gameService
                    .create({
                        playerOne:this.specialUsers[i - 1].userId,
                        playerTwo: this.specialUsers[i].userId,
                        option: OptionGame.special,
                        socketList: [this.specialUsers[i - 1].socketId, this.specialUsers[i].socketId],
                        powerList: this.listPowerUp
                    })
                this.specialUsers.splice(i - 1, 2)
                this.listRooms.push(newGame)
                break ;
            }
        }

        this.sendRooms(socket)
    }

    @SubscribeMessage('getCable')
    getCable(socket: Socket)
    {
        this.leaveUsers.push({userId: socket.data.user.id, socketId: socket.id})

        if (this.leaveUsers.length === 2 &&
            this.leaveUsers[1].userId !== this.leaveUsers[0].userId)
        {
            let data = {
                winner: this.leaveUsers[1].userId,
                losser: this.leaveUsers[0].userId
            }
            this.updateStats(socket, data)
            for (let i = 0; i <= this.leaveUsers.length; i++)
                this.leaveUsers.pop()
        }
    }
}
