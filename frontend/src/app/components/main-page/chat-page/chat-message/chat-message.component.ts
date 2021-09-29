import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { MessageI } from 'src/app/services/models/message.interface';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
	selector: 'app-chat-message',
	templateUrl: './chat-message.component.html',
	styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent
{
  	constructor(private router: Router) { }

	@Input() message!: MessageI;
	@Input() userId: any

	title: string = "";

	ngOnInit(): void {
		this.title = this.message.user!.nick.toUpperCase();
		if (this.message.user?.id == this.userId)
			this.title = "YOU";
	}

    challengeUser()
    {
        this.router.navigate([`mainPage/play/${this.userId}/matchmaking`])
    }

}
