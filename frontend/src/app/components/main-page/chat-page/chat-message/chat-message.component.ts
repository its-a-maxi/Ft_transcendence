import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { GameService } from 'src/app/services/game-service/game.service';
import { MessageI } from 'src/app/services/models/message.interface';
import { UserI } from 'src/app/services/models/user.interface';
import { PlayComponent } from '../../play/play.component';

@Component({
	selector: 'app-chat-message',
	templateUrl: './chat-message.component.html',
	styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent
{
  	constructor(private router: Router,
                private gameService: GameService) { }

	@Input() message!: MessageI;
	@Input() userId: any

	title: string = "";
    gameRoom: boolean = false

	ngOnInit(): void {
		this.title = this.message.user!.nick.toUpperCase();
		if (this.message.user?.id == this.userId)
			this.title = "YOU";
	}

    challengeUser()
    {
        console.log("ETOE: ", this.message)
        let enemy: number | undefined = (this.message.enemy! == this.userId) ?
            this.message.user?.id : this.message.enemy
        this.gameService.connect()
        this.gameService.createChallenge(enemy as number)
        this.router.navigate([`mainPage/play/private`])
        
    }

}
