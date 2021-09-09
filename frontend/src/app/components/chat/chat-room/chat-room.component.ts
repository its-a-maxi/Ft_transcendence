import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat-service';

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit
{
	userId: any
	rooms!: any[]
	users!: any[]
	selectedRoom: any = null;

	constructor(private chatService: ChatService,
				private authService: AuthService) { }

	ngOnInit(): void
	{
		this.userId = sessionStorage.getItem('token')
		this.chatService.getMyRooms().then(res => {
			this.rooms = res.data
			console.log(this.rooms)
		})
		this.authService.showAllUsers().then((res) => this.users = res.data)
	}

	deleteAllRooms()
	{
		this.chatService.deleteRooms(this.rooms)
	}

	onSelectRoom(event: MatSelectionListChange)
	{
		this.selectedRoom = event.source.selectedOptions.selected[0].value;
	}
}
