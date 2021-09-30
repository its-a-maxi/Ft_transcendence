import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ball } from 'src/app/components/pong-game/classes/class-ball';
import { Paddle } from 'src/app/components/pong-game/classes/class-paddle';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';

@Component({
	selector: 'app-show-room',
	templateUrl: './show-room.component.html',
	styleUrls: ['./show-room.component.css']
})
export class ShowRoomComponent implements OnInit, OnDestroy, AfterViewInit
{
	@Input() gameRoom!: GameI;
    gameOver: boolean = false

	canvas!: HTMLCanvasElement
	context!: CanvasRenderingContext2D
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

	userId: string = sessionStorage.getItem('token')!

	constructor(private gameService: GameService,
				private router: Router) { }

	ngOnInit(): void
	{
		this.gameOver = false
	}

	ngAfterViewInit()
	{
		this.canvas = <HTMLCanvasElement>document.getElementById("canvas")
		this.context = this.canvas.getContext("2d")!
		this.netHeight = this.canvas.height;

		this.gameService.addLiveUser()
		//this.gameRoom.option = "show"
		console.log(this.gameRoom)

		//this.gameService.createGame(this.gameRoom)
		this.gameService.startGame().subscribe(res => {
			if (this.gameRoom.id === res.roomId)
			{
				if (res.text === "GameOver" && !this.gameOver)
				{
                    this.gameOver = true
					//console.log("GAMEOVER")
					this.router.navigate([`/mainPage/settings/${this.userId}`])
					return
				}
				this.render(res.plOne, res.plTwo, res.ball)
			}
		})
	}

	ngOnDestroy()
	{
		this.gameService.removeLiveUser()
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
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
}
