import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat-service/chat-service';
import { RoomI } from 'src/app/services/models/room.interface';

@Component({
	selector: 'app-get-password',
	templateUrl: './get-password.component.html',
	styleUrls: ['./get-password.component.css']
})
export class GetPasswordComponent implements OnInit
{
	@Input() room!: RoomI

	constructor(private chatService: ChatService,
				private router: Router) { }


	password: string = "";
	@Output('ifPassword') ifPassword: EventEmitter<any> = new EventEmitter();

	ngOnInit(): void {
		
	}

	async changeChannel()
	{
		if (this.password === "")
		{
		  alert("Incorrect password");
		  this.password == "";
		  return;
		}
		await this.chatService.verifyPassword(this.password, this.room.id!)
			.then(() => {
				this.ifPassword.emit(true)
			})
			.catch(() => {
				alert("Incorrect password")
				this.password = ""
				this.ifPassword.emit(false)
			})
	}

}
