import { AfterViewInit, Component, DoCheck, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';
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
		private router: Router) { }//this.gameService.connect() }

	@Input() search: boolean = false;

	ngOnInit() {
		this.gameService.findUsers()
		this.gameService.getListUsers().subscribe(res => {
			if (res === null) {
				this.gameService.leaveRoom(this.roomId)
				this.router.navigate([`mainPage/settings/${this.userId}`])
				return
			}

			this.roomGame = res
			this.roomId = this.roomGame.id!
		})
	}

	ngOnDestroy() {
		this.gameService.leaveRoom(this.roomId)
	}

	changeCheck() {
		this.check = true
	}
}
