import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';
import { WaitingRoomComponent } from '../../game/waiting-room/waiting-room/waiting-room.component';

@Component({
	selector: 'app-play',
	templateUrl: './play.component.html',
	styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy
{

	Menu: boolean = true;
	OnlineMode: boolean = false;
	AImode: boolean = false;
	PowerUpMode: boolean = false;
	roomGame!: GameI;
	userId: string = sessionStorage.getItem('token')!

	@ViewChild('waitingRoom') waitingRoom?: WaitingRoomComponent;

	constructor(private gameService: GameService,
				private router: Router) { }

	ngOnInit(): void
	{

	}

	ngOnDestroy()
	{
		//this.gameService.leaveRoom()
	}

	changeToAi()
    {
        this.gameService.connect()
		this.gameService.playDemo()
		this.gameService.getDemo().subscribe(res => {
			this.roomGame = res
			console.log("Esto es gameroom: ", this.roomGame)
		})
		setTimeout(() => {
			this.AImode = true;
			this.Menu = false;
			//let btnDemo: HTMLElement = document.getElementById('demo')!
			//let btnNormal: HTMLElement = document.getElementById('normal')!
			//let btnSpecial: HTMLElement = document.getElementById('special')!
			//btnDemo!.style.display = "none"
			//btnNormal!.style.display = "none"
			//btnSpecial!.style.display = "none"
		}, 100) 
    }

	changeToOnline()
	{
		this.router.navigate([`mainPage/play/${this.userId}/matchmaking`])
		this.OnlineMode = true;
		this.Menu = false;
		this.gameService.connect()
	}

	changeSpecial()
	{

	}

}
