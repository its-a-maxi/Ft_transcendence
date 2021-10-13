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
		origin: ['http://localhost:3000', 'http://localhost:4200']
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

    challengeUsers: UserSocketI[] = []

    ///////////////

    paddleWidth: number = 10;
	paddleHeight: number = 100;
    canvasHeight: number = 600;
    canvasWidth: number = 800;

    upArrowPressed: boolean = false;
	downArrowPressed: boolean = false;
    upArrowPressed2: boolean = false;
	downArrowPressed2: boolean = false;
	key_wPressed: boolean = false;
	key_sPressed: boolean = false;

    /*POWERUPS*/
    PowerUpx2: boolean = false
    PowerUpQuickBall: number = 0
    PowerUpOnePoint: boolean = false
    PowerUpQuickPalette: number = 10

	constructor(private userService: UsersService,
                private gameService: GameService) {}

    async onModuleInit()
    {
        this.listRooms = []
        this.normalUsers = []
        this.specialUsers = []
        this.liveShowUsers = []
        this.leaveUsers = []
        this.challengeUsers = []
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
		const curr_user: UserSocketI = {userId: socket.data.user.id, socketId: socket.id}
        for (let room of this.listRooms)
        {
            let losser: number = socket.data.user.id
            let winner: number = 0
            if (curr_user.userId === room.playerOne && room.playerTwo === -1)
            {
                let message = {
                    roomId: room.id,
                    text: "GameOver"
                }
                this.server.to(room.socketList[0]).emit('startGame', message)
                for (let user of this.liveShowUsers)
                    this.server.to(user.socketId).emit('startGame', message)
                this.onLeaveRoom(socket, room.id)
                break
            }
            if (room.playerOne === losser)
                winner = room.playerTwo
            else if (room.playerTwo === losser)
                winner = room.playerOne
            if (winner)
            {
                let message = {
                    roomId: room.id,
                    text: "GameOver",
                    winner, 
                    losser
                }
                this.server.to(room.socketList[0]).emit('startGame', message)
                this.server.to(room.socketList[1]).emit('startGame', message)
                for (let user of this.liveShowUsers)
                    this.server.to(user.socketId).emit('startGame', message)
                this.onLeaveRoom(socket, room.id)
                break ;
            }
        }
        this.removeUser(curr_user)
		socket.disconnect();
	}

	private disconnect(socket: Socket)
	{
		socket.emit('Error', new UnauthorizedException())
		socket.disconnect()
	}

	private removeUser(userSocket: UserSocketI)
	{
        if (this.normalUsers.length === 1)
            this.normalUsers.splice(0, 1)
        else
        {
            let index = this.normalUsers.indexOf(userSocket)
            if (index > -1)
                this.normalUsers.splice(index, 1)
        }

        if (this.specialUsers.length === 1)
            this.specialUsers.splice(0, 1)
        else
        {
            let index = this.specialUsers.indexOf(userSocket)
            if (index > -1)
                this.specialUsers.splice(index, 1)
        }

        if (this.challengeUsers.length === 1)
            this.challengeUsers.splice(0, 1)
        else
        {
            let index = this.challengeUsers.indexOf(userSocket)
            if (index > -1)
                this.challengeUsers.splice(index, 1)
        }

        if (this.liveShowUsers.length === 1)
            this.liveShowUsers.splice(0, 1)
        else
        {
            let index = this.liveShowUsers.indexOf(userSocket)
            if (index > -1)
                this.liveShowUsers.splice(index, 1)
        }
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
        if (this.liveShowUsers.length === 1)
            this.liveShowUsers.pop()
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
                if (room.powerList && this.listPowerUp.length === 2)
                    this.listPowerUp.splice(0, 2)
                break ;
            }
        }
        await this.userService.updateStatus(Status.online, userId)
		this.disconnect(socket)
	}

	@SubscribeMessage('findUsers')
	async findUsers(socket: Socket)
	{
        const user: UserSocketI = {userId: socket.data.user.id, socketId: socket.id}
        this.normalUsers.push(user)
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
                await this.userService.updateStatus(Status.inGame,  this.normalUsers[i - 1].userId)
                await this.userService.updateStatus(Status.inGame,  this.normalUsers[i].userId)
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
        this.server.emit('liveRooms', this.listRooms)
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

	///////////////////////////////////////////////////////////////

    @SubscribeMessage('challengeRoom')
    async challengeRoom(socket: Socket, enemy: number)
    {

        this.challengeUsers.push({userId: socket.data.user.id, socketId: socket.id, enemy})

        for (let i = 0; i < this.challengeUsers.length; i++)
        {
            for (let j = i + 1; j < this.challengeUsers.length; j++)
            {
                if (this.challengeUsers[i].userId === this.challengeUsers[j].enemy &&
                    this.challengeUsers[i].enemy === this.challengeUsers[j].userId)
                    {
                        const newGame: GameI = await this.gameService
                        .create({
                            playerOne: this.challengeUsers[i].userId,
                            playerTwo: this.challengeUsers[j].userId,
                            option: OptionGame.challenge,
                            socketList: [this.challengeUsers[i].socketId, this.challengeUsers[j].socketId]
                        })
                        await this.userService.updateStatus(Status.inGame, this.challengeUsers[i].userId)
                        await this.userService.updateStatus(Status.inGame, this.challengeUsers[i].userId)
                        this.challengeUsers.splice(i, 1)
                        this.challengeUsers.splice(j, 1)
                        this.listRooms.push(newGame)
                        break ;
                    }
            }
        }
        this.sendRooms(socket)
    }

    private checkPowerUps(game: GameI)
    {
        this.PowerUpQuickBall = 0;
        this.PowerUpx2 = false
        this.PowerUpOnePoint = false
        this.PowerUpQuickPalette= 8
        this.paddleWidth = 10;
	    this.paddleHeight = 100;
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
                    this.PowerUpQuickPalette = 20;
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
        	setTimeout(() => {let interId: any = setInterval(() => {
                this.update(plOne, plTwo, ball, game, interId)}
                , 1000 / 60)}, 1500) 
        
    }

	private resetBallPos(ball: Ball)
	{
		ball.x = this.canvasWidth / 2;
		ball.y = this.canvasHeight / 2;
		ball.speed = 7;
        if (ball.velocityX < 0)
            ball.velocityX = +5
        else
            ball.velocityX = -5
        if (ball.velocityY < 0)
		    ball.velocityY = +5
        else
            ball.velocityY = -5
		
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

    private update(plOne: Paddle, plTwo: Paddle, ball: Ball, game: GameI, interId: any)
    {
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;

        if (this.upArrowPressed && plOne.y > 0)
            plOne.y -= this.PowerUpQuickPalette;
        else if (this.downArrowPressed &&
            (plOne.y < this.canvasHeight - this.paddleHeight))
            plOne.y += this.PowerUpQuickPalette;

        if (this.upArrowPressed2 && plTwo.y > 0)
            plTwo.y -= this.PowerUpQuickPalette;
        else if (this.downArrowPressed2 &&
            (plTwo.y < this.canvasHeight - this.paddleHeight))
            plTwo.y += this.PowerUpQuickPalette;

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
			ball.speed += 0.4;
            ball.speed += this.PowerUpQuickBall
		}

		if (game.playerTwo === -1)
			plTwo.y += ((ball.y - (plTwo.y + this.paddleHeight / 2))) * 0.14; 
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
                if (game.playerOne !== user.userId && game.playerTwo !== user.userId)
                    this.server.to(user.socketId).emit('startGame', data)
                
		}
		else
        {
            let winner: number = (plOne.score > plTwo.score) ?  plOne.player : plTwo.player;
            let losser: number = (plOne.score > plTwo.score) ?  plTwo.player : plOne.player;
            let message = {
                roomId: game.id,
                text: "GameOver",
                winner,
                losser
            }
            this.server.to(game.socketList[0]).emit('startGame', message)
            this.server.to(game.socketList[1]).emit('startGame', message)
            for (let user of this.liveShowUsers)
            {
                if (game.playerOne !== user.userId && game.playerTwo !== user.userId)
                    this.server.to(user.socketId).emit('startGame', message)
            }
            clearInterval(interId)
		}
		
    }

	@SubscribeMessage('keyboard')
	handdleKeyboard(socket: Socket, data: any)
	{
        if (socket.id === data.game.socketList[0])
        {
            this.upArrowPressed =  data.keyUp 
            this.downArrowPressed = data.keyDown
        }
        else if (socket.id === data.game.socketList[1])
        {
            this.upArrowPressed2 =  data.keyUp
            this.downArrowPressed2 = data.keyDown
        }
	}

    @SubscribeMessage('updateStats')
    async updateStats(socket: Socket, data: any)
    {
       if (data.winner !== -1 && data.losser !== -1)
       {
           const userOne: UserI = await this.userService.getUser(data.winner)
           const userTwo: UserI = await this.userService.getUser(data.losser)
           if (!userOne.matches)
            userOne.matches = [];
            if (!userTwo.matches)
             userTwo.matches = [];
           if (userOne.id === data.winner)
           {
                userOne.wins += 1;
                userTwo.defeats += 1;
                userOne.matches.push('Wins vs ' + userTwo.nick);
                userTwo.matches.push('Losses vs ' + userOne.nick);
                await this.userService.updateWins(userOne.wins, userOne.id)
                await this.userService.updateDefeats(userTwo.defeats, userTwo.id)
           }
           else if (userOne.id === data.losser)
           {
                userTwo.wins += 1;
                userOne.defeats += 1;
                userOne.matches.push('Losses vs ' + userTwo.nick);
                userTwo.matches.push('Wins vs ' + userOne.nick);
                await this.userService.updateWins(userTwo.wins, userTwo.id)
                await this.userService.updateDefeats(userOne.defeats, userOne.id)
           }
           await this.userService.updateFriends(userOne);
           await this.userService.updateFriends(userTwo);
       }
    }

    @SubscribeMessage('createSpecialRooms')
    async createSpecialRooms(socket: Socket, option: any)
    {
        const user: UserSocketI = {userId: socket.data.user.id, socketId: socket.id}
        this.specialUsers.push(user)
        this.listPowerUp.push(Object.keys(option).toString())
        
        for (let i = 0; i < this.specialUsers.length; i++)
        {
            if (i != 0 && this.specialUsers[i].userId !== this.specialUsers[i - 1].userId)
            {
                const newGame: GameI = await this.gameService
                    .create({
                        playerOne: this.specialUsers[i - 1].userId,
                        playerTwo: this.specialUsers[i].userId,
                        option: OptionGame.special,
                        socketList: [this.specialUsers[i - 1].socketId, this.specialUsers[i].socketId],
                        powerList: this.listPowerUp
                    })
                await this.userService.updateStatus(Status.inGame, this.specialUsers[i - 1].userId)
                await this.userService.updateStatus(Status.inGame, this.specialUsers[i].userId)
                this.specialUsers.splice(i - 1, 2)
                this.listRooms.push(newGame)
                break ;
            }
        }

        this.sendRooms(socket)
    }

    @SubscribeMessage('checkConnection')
    checkConnection(socket: Socket)
    {
        
        if (this.normalUsers.length === 0)
            this.server.to(socket.id).emit('listUsers', 'normal')
        else if (this.specialUsers.length === 0)
            this.server.to(socket.id).emit('listUsers', 'special')
        else if (this.challengeUsers.length === 0)
            this.server.to(socket.id).emit('listUsers', 'challenge')
    }
}
