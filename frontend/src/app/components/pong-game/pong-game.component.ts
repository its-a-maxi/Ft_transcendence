import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { isAbsolute } from 'path';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';
import { Ball } from './classes/class-ball';
import { Paddle } from './classes/class-paddle';

@Component({
	selector: 'app-pong-game',
	templateUrl: './pong-game.component.html',
	styleUrls: ['./pong-game.component.css']
})
export class PongGameComponent implements OnInit, AfterViewInit
{
	@Input() gameRoom!: GameI

	canvas!: HTMLCanvasElement
	context!: CanvasRenderingContext2D
	upArrowPressed = false;
	downArrowPressed = false;
	key_wPressed = false;
	key_sPressed = false;
	// -> Net
	netWidth = 4;
	netHeight!: number;

	// -> Paddles
	paddleWidth = 10;
	paddleHeight = 100;

	// -> Colors
	backgroundColor = "#000";
	elementsColor = "#FFF";

	test: any

	constructor(private gameService: GameService) { }

	ngAfterViewInit()
    {
		this.canvas = <HTMLCanvasElement>document.getElementById("canvas")
		this.context = this.canvas.getContext("2d")!
		this.netHeight = this.canvas.height;


		// let user = new Paddle(10, this.canvas.height / 2 - this.paddleHeight / 2,
		// 	0, this.gameRoom.playerOne!, this.gameRoom.id!);
		// let ai = new Paddle(this.canvas.width - (this.paddleWidth + 10),
		// 	this.canvas.height / 2 - this.paddleHeight / 2, 0, this.gameRoom.playerTwo!, this.gameRoom.id!)
		// let ball = new Ball(this.canvas.width / 2, this.canvas.height / 2, 7, 5, 5);
        
        this.gameService.createGame(this.gameRoom)

        this.gameService.startGame().subscribe(res => {
			this.ft_gameLoop(res.plOne, res.plTwo, res.ball, this.gameRoom)
            //setInterval(() => this.ft_gameLoop(res.plOne, res.plTwo, res.ball, this.gameRoom), 1000 / 30)
        })
		
		//setInterval(() => this.ft_gameLoop(user, ai, ball, this.gameRoom), 1000 / 60)
	}

	ngOnInit(): void
	{
		this.keyboard()
	}

	keyboard()
	{
		window.addEventListener("keydown", (event) => {
			if (event.key == "ArrowUp")
				this.upArrowPressed = true;
			else if (event.key == "ArrowDown")
				this.downArrowPressed = true;
			let data = {
				keyUp: this.upArrowPressed,
				keyDown: this.downArrowPressed,
				keyW: this.key_wPressed,
				keyS: this.key_sPressed
			}
			this.gameService.keyReled(data)
		});

		window.addEventListener("keyup", (event) => {
			if (event.key == "ArrowUp")
				this.upArrowPressed = false;
			else if (event.key == "ArrowDown")
				this.downArrowPressed = false;
			let data = {
				keyUp: this.upArrowPressed,
				keyDown: this.downArrowPressed,
				keyW: this.key_wPressed,
				keyS: this.key_sPressed
			}
			this.gameService.keyReled(data)
		});

		window.addEventListener("keydown", (event) => {
			if (event.key == "w")
				this.key_wPressed = true;
			else if (event.key == "s")
			 	this.key_sPressed = true;
            let data = {
                keyUp: this.upArrowPressed,
                keyDown: this.downArrowPressed,
                keyW: this.key_wPressed,
                keyS: this.key_sPressed
            }
            this.gameService.keyReled(data)
		});

		window.addEventListener("keyup", (event) => {
			if (event.key == "w")
				this.key_wPressed = false;
			else if (event.key == "s")
				this.key_sPressed = false;
            let data = {
                keyUp: this.upArrowPressed,
                keyDown: this.downArrowPressed,
                keyW: this.key_wPressed,
                keyS: this.key_sPressed
            }
            this.gameService.keyReled(data)
		});
        
	}

	render(userOne: Paddle, userTwo: Paddle, ball: Ball)
	{
		this.context!.fillStyle = this.backgroundColor;													// Sets background color.
		this.context!.fillRect(0, 0, this.canvas.width, this.canvas.height);									// Draws background.
		this.context!.fillStyle = this.elementsColor;														// Sets elements color.
		this.context!.font = "35px sans-serif";														// Sets font for text elements (score).
		this.context!.fillRect(this.canvas.width / 2 - this.netWidth / 2, 0, this.netWidth, this.netHeight);				// Draws net.
		this.context!.fillText(userOne.score.toString(), this.canvas.width / 4, this.canvas.height / 6);			// Draws user score.
		this.context!.fillText(userTwo.score.toString(), 3 * this.canvas.width / 4, this.canvas.height / 6);			// Draws ai score.
		this.context!.fillRect(userOne.x, userOne.y, this.paddleWidth, this.paddleHeight);							// Draws user paddle.
		this.context!.fillRect(userTwo.x, userTwo.y, this.paddleWidth, this.paddleHeight);								// Draws ai paddle.
		this.context!.beginPath();																	// Draws ball.
		this.context!.arc(ball.x, ball.y, 7, 0, Math.PI * 2, true);
		this.context!.closePath();
		this.context!.fill();
	}

	resetBallPos(ball: Ball)
	{
		ball.x = this.canvas.width / 2;
		ball.y = this.canvas.height / 2;
		ball.speed = 7;
		ball.velocityX = -ball.velocityX;
		ball.velocityY = -ball.velocityY;
		
	}

	paddleCollision(paddle: Paddle, ball: Ball): boolean
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

	update(userOne: Paddle, userTwo: Paddle, ball: Ball)
	{
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;

		// if (this.key_wPressed && userOne.y > 0)
		// 	userOne.y -= 8;
		// else if (this.key_sPressed && (userOne.y < this.canvas.height - this.paddleHeight))
		// 	userOne.y += 8;

		// if (this.upArrowPressed && userTwo.y > 0)
		// 	userTwo.y -= 8;
		// else if (this.downArrowPressed && (userTwo.y < this.canvas.height - this.paddleHeight))
		// 	userTwo.y += 8;
		
		// if (ball.y + 7 >= this.canvas.height || ball.y - 7 <= 0)
		// {
		// 	ball.velocityY = -ball.velocityY;
		// }

		// if (ball.x + 7 >= this.canvas.width)
		// {
		// 	userOne.score += 1;
		// 	this.resetBallPos(ball);
		// }
		// if (ball.x - 7 <= 0)
		// {
		// 	userTwo.score += 1;
		// 	this.resetBallPos(ball);
		// }

		// let paddle: Paddle;
		// if (ball.x <= this.canvas.width / 2)
		// 	paddle = userOne;
		// else
		// 	paddle = userTwo;
	
		// if (this.paddleCollision(paddle, ball))
		// {
		// 	let angle = 0;
		// 	if (ball.y < (paddle.y + this.paddleHeight / 2))
		// 		angle = -(Math.PI / 4);
		// 	else if (ball.y > (paddle.y + this.paddleHeight / 2))
		// 		angle = Math.PI / 4;
		// 	let dir = -1;
		// 	if (paddle === userOne)
		// 		dir = 1;
		// 	ball.velocityX = dir * ball.speed * Math.cos(angle);
		// 	ball.velocityY = ball.speed * Math.sin(angle);
		// 	ball.speed += 0.2;
		// }
	}

	ft_gameLoop(userOne: Paddle, userTwo: Paddle, ball: Ball, gameRoom: GameI)
	{
		//if (userOne.gameId === gameRoom.id && userTwo.gameId === gameRoom.id)
		//{
            //this.keyboard()
			//this.update(userOne, userTwo, ball);
			this.render(userOne, userTwo, ball);
		//}
	}

}
