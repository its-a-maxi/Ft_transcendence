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
	/* POWER UPS */
	PowerUpx2: boolean = false;
	PowerUpBigPalette: boolean = false;
	PowerUpDisco: boolean = false;
	PowerUpQuickBall: boolean = false;
	PowerUpOnePoint: boolean = false;
	PowerUpQuickPalette: boolean = false;
	PowerUpTennis: boolean = false;
	PowerUpRandom: boolean = false;

	/* RENDER */
	Menu: boolean = true;
	OnlineMode: boolean = false;
	AImode: boolean = false;
	PowerUpMode: boolean = false;
	PowerUpSelect: boolean = false;


	roomGame!: GameI;
	userId: string = sessionStorage.getItem('token')!
    liveRooms!: GameI[];
    show: boolean = false
    roomSelected!: GameI;

	constructor(private gameService: GameService,
				private router: Router) { }

	ngOnInit(): void
	{
        this.gameService.showRooms()
        this.gameService.getLiveRooms().subscribe(res => {
            this.liveRooms = res
            console.log(res)
        })
	}

	ngOnDestroy()
	{
		//this.gameService.leaveRoom()
        this.gameService.disconnect()
	}

	changeToAi()
    {
		let pongContainer = document.getElementById("pongContainer");
		pongContainer!.style.backgroundColor = 'rgba(19, 5, 11, 1)';
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
		let pongContainer = document.getElementById("pongContainer");
		pongContainer!.style.backgroundColor = 'rgba(19, 5, 11, 1)';
		this.router.navigate([`mainPage/play/${this.userId}/matchmaking`])
		this.OnlineMode = true;
		this.Menu = false;
		this.gameService.connect()
        this.gameService.findUsers()
	}

	changeToPowerUp()
	{
		let i = Math.round(Math.random() * (6 - 0) + 0);
        let powerUps = [
            {PowerUpx2: this.PowerUpx2},
		    {PowerUpBigPalette: this.PowerUpBigPalette},
		    {PowerUpDisco: this.PowerUpDisco},
		    {PowerUpQuickBall: this.PowerUpQuickBall},
		    {PowerUpOnePoint: this.PowerUpOnePoint},
		    {PowerUpQuickPalette: this.PowerUpQuickPalette},
		    {PowerUpTennis: this.PowerUpTennis},
        ];

        for (let option of powerUps)
        {
            if (Object.values(option).includes(true) || this.PowerUpRandom)
            {
                let pongContainer = document.getElementById("pongContainer");
		        pongContainer!.style.backgroundColor = 'rgba(19, 5, 11, 1)';
				if (this.PowerUpRandom)
					this.gameService.createSpecialRoom(powerUps[Math.round(Math.random() * (6 - 0) + 0)])
				else
                	this.gameService.createSpecialRoom(option)
                this.PowerUpSelect = false
                this.router.navigate([`mainPage/play/${this.userId}/matchmaking`])
                this.gameService.connect()
                return
            }
        }
	}

    viewShowRoom(room :GameI)
    {
		let pongContainer = document.getElementById("pongContainer");
		pongContainer!.style.backgroundColor = 'rgba(19, 5, 11, 1)';
        this.show = true
        this.Menu = false;
        this.roomSelected = room
        this.router.navigate([`mainPage/play/${this.userId}/showRoom`])
        this.gameService.connect()
    }

	justOne(save: boolean)
	{
		this.PowerUpx2 = false;
		this.PowerUpBigPalette = false;
		this.PowerUpDisco = false;
		this.PowerUpQuickBall = false;
		this.PowerUpOnePoint = false;
		this.PowerUpQuickPalette = false;
		this.PowerUpTennis = false;
		this.PowerUpRandom = false;
		save = true;
	}

	reloadPage()
	{
		this.router.navigate([`/mainPage/play/${this.userId}`])
		.then(()=>{
			window.location.reload();
		});
	}

}
