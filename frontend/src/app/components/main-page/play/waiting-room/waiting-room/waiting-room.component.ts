import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';
import { RoomI } from 'src/app/services/models/room.interface';
import { UserI } from 'src/app/services/models/user.interface';

interface PlayerI {
	plOne: number;
	plTwo: number;
}

@Component({
	selector: 'app-waiting-room',
	templateUrl: './waiting-room.component.html',
	styleUrls: ['./waiting-room.component.css']
})

export class WaitingRoomComponent implements OnInit {
	check: boolean = false;

	roomGame!: GameI
	roomId: number = 0
	userId: string = sessionStorage.getItem('token')!

	constructor(private gameService: GameService,
		private router: Router) { }

	@Input() search: boolean = false;

	ngOnInit()
    {
		this.gameService.getListUsers().subscribe(res => {
            
			if (res === null)
            {
				return
			}
			this.roomGame = res
			this.roomId = this.roomGame.id!
		})
	}

	changeCheck() {
		this.check = true
	}
}
