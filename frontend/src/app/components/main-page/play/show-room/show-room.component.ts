import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game-service/game.service';
import { GameI } from 'src/app/services/models/gameRoom.interface';

@Component({
	selector: 'app-show-room',
	templateUrl: './show-room.component.html',
	styleUrls: ['./show-room.component.css']
})
export class ShowRoomComponent implements OnInit, OnDestroy
{
	@Input() gameRoom!: GameI;

	constructor(private gameService: GameService) { }

	ngOnInit(): void
	{
		this.gameService.addLiveUser()
		this.gameRoom.option = "show"
		console.log(this.gameRoom)
		this.gameService.createGame(this.gameRoom)
	}

	ngOnDestroy()
	{
		this.gameService.removeLiveUser()
	}
}
