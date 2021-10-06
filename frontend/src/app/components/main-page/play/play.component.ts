import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';
import { RoomI } from 'src/app/services/models/room.interface';
import { User } from 'src/app/services/models/user';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
	selector: 'app-play',
	templateUrl: './play.component.html',
	styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit
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
	showRoom: boolean = false;


	roomGame!: GameI;
	userId: string = sessionStorage.getItem('token') as string
    liveRooms!: GameI[];
    show: boolean = false
    roomSelected!: GameI;
    waiting: boolean = false
	private allUsers: UserI[] = [];
    roomPrivate: string = ""
    numId: number = parseInt(this.userId)

	constructor(private gameService: GameService,
				private router: Router,
				public authService: AuthService,
                private activateRoute: ActivatedRoute) {this.gameService.connect()}

	async ngOnInit()
	{
        this.roomPrivate = this.activateRoute.snapshot.paramMap.get('id')?.substr(0, 7)!
        if (this.roomPrivate === 'private')
            this.waiting = true
        //this.gameService.addLiveUser()
        this.gameService.showRooms()
        this.gameService.getLiveRooms().subscribe(res => {
            
            this.liveRooms = res
        })
		await this.authService.showAllUsers()
		   .then(response => this.allUsers = response.data);
		if (this.router.url != '/mainPage/play/' + this.userId)
			this.Menu = false;
	}

	changeToAi()
    {
		let pongContainer = document.getElementById("pongContainer");
		pongContainer!.style.backgroundColor = 'rgba(19, 5, 11, 1)';
        this.gameService.connect()
		this.gameService.playDemo()
		this.gameService.getDemo().subscribe(res => {
			this.roomGame = res
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
		//this.router.navigate([`mainPage/play/${this.userId}/matchmaking`])
		this.OnlineMode = true;
		this.Menu = false;
        this.waiting = true
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
                //this.router.navigate([`mainPage/play/${this.userId}/matchmaking`])
                this.waiting = true
                this.gameService.connect()
                return
            }
        }
	}

    viewShowRoom(room :GameI)
    {
		let pongContainer = document.getElementById("pongContainer");
		pongContainer!.style.backgroundColor = 'rgba(19, 5, 11, 1)';
        this.Menu = false;
        this.roomSelected = room
		this.showRoom = true;
        this.show = true
        //this.gameService.connect()
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
                this.gameService.disconnect()
                window.location.reload();
            });
	}

	getIdName(id: number): string
	{
		for (let i = 0; this.allUsers[i]; i++)
			if (this.allUsers[i].id == id)
				return (this.allUsers[i].nick);
		return ('AI');
	}
	getRoomName(room: GameI): string
	{
		return (this.getIdName(room.playerOne!) + ' vs ' + this.getIdName(room.playerTwo!));
	}
	getRoomOption(option: string): string
	{
		if (option == 'normal')
			return ('online');
		else if (option == 'demo')
			return ('vs Ai');
		else
			return ('power-ups');
	}

}
