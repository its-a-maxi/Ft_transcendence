import { Component, Input, OnInit } from '@angular/core';
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

	@Input() message!: MessageI;
	@Input() userId: any

  	constructor() { }

}
