import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game-service/game.service';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
	selector: 'app-waiting-room',
	templateUrl: './waiting-room.component.html',
	styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit, OnDestroy
{
	check: boolean = false
	lenUsers: number = 0

	user = this.gameService.getListUsers().subscribe(res => {this.lenUsers = res.len})

	constructor(private gameService: GameService) { }

	ngOnInit(): void
	{
	}

	ngOnDestroy()
	{
		this.gameService.leaveRoom()
	}

	changeCheck()
	{
		this.check = true
	}

}
