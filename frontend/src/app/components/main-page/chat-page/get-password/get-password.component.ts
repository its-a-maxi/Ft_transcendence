import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { RoomI } from 'src/app/services/models/room.interface';

@Component({
	selector: 'app-get-password',
	templateUrl: './get-password.component.html',
	styleUrls: ['./get-password.component.css']
})
export class GetPasswordComponent implements OnInit
{
	constructor(private chatService: ChatService,
				private router: Router) { }


	password: string = "";

	@Input() title: string = "";
	@Output('function') function: EventEmitter<any> = new EventEmitter();

	ngOnInit(): void {
		
	}

	async changeChannel()
	{
		let check = /^[a-zA-Z0-9-]+$/;
		if (!this.password.match(check) && this.password != "")
			alert("Please, use valid characters for your channel password");
		else
			this.function.emit(this.password);
		this.password = "";
	}

}
