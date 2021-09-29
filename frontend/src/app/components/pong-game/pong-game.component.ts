import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class PongGameComponent implements OnInit, AfterViewInit, OnDestroy
{
	@Input() gameRoom!: GameI

	userId: string = sessionStorage.getItem('token')!

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
	backgroundColor = 'rgb(19, 5, 11)';
	elementsColor = "#ede5f2ff";
	scoreColor = "rgba(237, 229, 242, 0.2)";

	test: any

	constructor(private gameService: GameService,
				private router: Router) { }

	ngAfterViewInit()
    {
		this.canvas = <HTMLCanvasElement>document.getElementById("canvas")
		//console.log(this.canvas.height);
		//this.canvas.style.transform = 'scale(0.01)';
		this.context = this.canvas.getContext("2d")!
		this.netHeight = this.canvas.height;
        
        this.gameService.createGame(this.gameRoom)

        this.gameService.startGame().subscribe(res => {
			if (res === "GameOver")
			{
				console.log("GAMEOVER")
				this.router.navigate([`/mainPage/settings/${this.userId}`])
				return
			}
			this.ft_gameLoop(res.plOne, res.plTwo, res.ball, this.gameRoom)
        })
		
	}

	ngOnInit(): void
	{
		this.keyboard()
	}

	ngOnDestroy()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.gameService.leaveRoom(this.gameRoom.id!)
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
		this.context!.font = "20vh futura";														// Sets font for text elements (score).
		this.context!.fillRect(this.canvas.width / 2 - this.netWidth / 2, 0, this.netWidth, this.netHeight);				// Draws net.
		this.context!.fillStyle = this.scoreColor;														// Sets elements color.
		this.context!.fillText(userOne.score.toString(), this.canvas.width / 5, this.canvas.height / 1.6);			// Draws user score.
		this.context!.fillText(userTwo.score.toString(), 3 * this.canvas.width / 4.7, this.canvas.height / 1.6);			// Draws ai score.
		this.context!.fillStyle = this.elementsColor;														// Sets elements color.
		this.context!.fillRect(userOne.x, userOne.y, this.paddleWidth, this.paddleHeight);							// Draws user paddle.
		this.context!.fillRect(userTwo.x, userTwo.y, this.paddleWidth, this.paddleHeight);								// Draws ai paddle.
		this.context!.beginPath();																	// Draws ball.
		this.context!.arc(ball.x, ball.y, 7, 0, Math.PI * 2, true);
		this.context!.closePath();
		this.context!.fill();
	}

	ft_gameLoop(userOne: Paddle, userTwo: Paddle, ball: Ball, gameRoom: GameI)
	{
		if (userOne.gameId === gameRoom.id && userTwo.gameId === gameRoom.id)
			this.render(userOne, userTwo, ball);
	}

}
