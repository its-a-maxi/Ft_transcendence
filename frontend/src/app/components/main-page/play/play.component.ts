import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';

@Component({
	selector: 'app-play',
	templateUrl: './play.component.html',
	styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit, OnDestroy
{

	demo: boolean = false;
	roomGame!: GameI;
	userId: string = sessionStorage.getItem('token')!

	constructor(private gameService: GameService,
				private router: Router) { }

	ngOnInit(): void
	{

	}

	ngOnDestroy()
	{
		//this.gameService.leaveRoom()
	}

	changeDemo()
    {
        this.gameService.connect()
		this.gameService.playDemo()
		this.gameService.getDemo().subscribe(res => {
			this.roomGame = res
			console.log("Esto es gameroom: ", this.roomGame)
		})
		setTimeout(() => {
			this.demo = true
			let btnDemo: HTMLElement = document.getElementById('demo')!
			let btnNormal: HTMLElement = document.getElementById('normal')!
			let btnSpecial: HTMLElement = document.getElementById('special')!
			btnDemo!.style.display = "none"
			btnNormal!.style.display = "none"
			btnSpecial!.style.display = "none"
		}, 100) 
    }

	changeNormal()
	{
		this.router.navigate([`mainPage/waitingRoom/${this.userId}`])
		this.gameService.connect()
	}

	changeSpecial()
	{

	}

}
