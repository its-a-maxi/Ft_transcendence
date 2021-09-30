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
	randomColors = false;
	wimbledon = false;

	test: any

	winner: string = 'mmonroy-';

	end: boolean = false;

	constructor(private gameService: GameService,
				private router: Router) { }

	ngAfterViewInit()
    {
		console.log(this.gameRoom);
		this.canvas = <HTMLCanvasElement>document.getElementById("canvas")
		//console.log(this.canvas.height);
		//this.canvas.style.transform = 'scale(0.01)';
		this.context = this.canvas.getContext("2d")!
		this.netHeight = this.canvas.height;

        this.gameService.createGame(this.gameRoom)

        this.gameService.startGame().subscribe(res => {
			if (res.text === "GameOver")
			{
				//console.log("GAMEOVER WINER IS: ", res.winner)
				this.winner = res.winner;
                let data = {
                    winner: res.winner,
                    losser: res.losser
                }
                this.gameService.updateStats(data)
				this.end = true;
                this.gameService.disconnect()
				//this.router.navigate([`/mainPage/play/${this.userId}`])
				return
			}
            if (this.gameRoom.powerList)
            {
                for (let power of this.gameRoom.powerList)
                {
                    if (power === 'PowerUpBigPalette')
                    {
                        this.paddleWidth = 20
                        this.paddleHeight = 200;
                    }
					else if (power === 'PowerUpDisco')
						this.randomColors = true;
					else if (power === 'PowerUpTennis')
						this.wimbledon = true;
                }
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
		if (this.randomColors)
			this.elementsColor = this.getRandomColor();
		if (this.wimbledon)
		{
			this.context!.fillStyle = '#5A8841';														// Sets background color.
			this.context!.fillRect(0, 0, this.canvas.width, this.canvas.height/8);
			this.context!.fillRect(0, this.canvas.height/8 * 2, this.canvas.width, this.canvas.height/8);
			this.context!.fillRect(0, this.canvas.height/8 * 4, this.canvas.width, this.canvas.height/8);
			this.context!.fillRect(0, this.canvas.height/8 * 6, this.canvas.width, this.canvas.height/8);
			this.context!.fillStyle = '#7AA960';
			this.context!.fillRect(0, this.canvas.height/8, this.canvas.width, this.canvas.height/8);
			this.context!.fillRect(0, this.canvas.height/8 * 3, this.canvas.width, this.canvas.height/8);
			this.context!.fillRect(0, this.canvas.height/8 * 5, this.canvas.width, this.canvas.height/8);
			this.context!.fillRect(0, this.canvas.height/8 * 7, this.canvas.width, this.canvas.height/8);
		}
		else
		{
			this.context!.fillStyle = this.backgroundColor;														// Sets background color.
			this.context!.fillRect(0, 0, this.canvas.width, this.canvas.height);									// Draws background.
		}
		this.context!.fillStyle = this.elementsColor;														// Sets elements color.
		this.context!.font = "20vh futura";														// Sets font for text elements (score).
		this.context!.fillRect(this.canvas.width / 2 - this.netWidth / 2, 0, this.netWidth, this.netHeight);				// Draws net.
		this.context!.fillStyle = this.scoreColor;														// Sets elements color.
		this.context!.fillText(userOne.score.toString(), this.canvas.width / 5, this.canvas.height / 1.6);			// Draws user score.
		this.context!.fillText(userTwo.score.toString(), 3 * this.canvas.width / 4.7, this.canvas.height / 1.6);			// Draws ai score.
		this.context!.fillStyle = this.elementsColor;														// Sets elements color.
		this.context!.fillRect(userOne.x, userOne.y, this.paddleWidth, this.paddleHeight);							// Draws user paddle.
		this.context!.fillRect(userTwo.x, userTwo.y, this.paddleWidth, this.paddleHeight);								// Draws ai paddle.
		if (this.wimbledon)
			this.context!.fillStyle = '#EBFF00';
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

	gameEnds()
	{
		this.router.navigate([`/mainPage/play/${this.userId}`])
		.then(()=>{
			window.location.reload();
		});
	}

	private getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	  }

}
