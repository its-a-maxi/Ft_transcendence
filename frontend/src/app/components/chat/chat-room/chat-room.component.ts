import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat-service';
import { RoomI } from 'src/app/services/models/room.interface';
import { UserI } from 'src/app/services/models/user.interface';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit
{
	userId: any
	rooms!: RoomI[]
	users!: any[]
	selectedRoom: any = null;
	currentUser!: UserI
	usersConnected!: UserI[]
	listBlockUser: UserI[] = []

	constructor(private chatService: ChatService,
				private authService: AuthService) { }

	ngOnInit(): void
	{
		this.userId = sessionStorage.getItem('token')
		this.findRooms()
		this.authService.showAllUsers().then((res) => this.users = res.data)
		this.authService.getUserById(this.userId)
			.then(res =>this.currentUser = res.data)
		this.chatService.findUsersConnected()
		this.chatService.getConnectedUsers().subscribe(res => {
			this.usersConnected = res
			console.log(this.usersConnected)
		})
	}

	findRooms()
	{
		this.chatService.getMyRooms().subscribe(res => {
			this.rooms = res
			console.log(this.rooms)
		})
	}

	deleteAllRooms()
	{
		this.chatService.deleteRooms(this.rooms)
	}

	onSelectRoom(event: MatSelectionListChange)
	{
		this.selectedRoom = event.source.selectedOptions.selected[0].value;
	}

	deleteRoom(room: RoomI)
	{
		let option = confirm("Are you sure to leave this ChatRoom?")
		if (!option)
			return
		this.chatService.deleteRoom(room)
		window.location.reload()
		
	}

	directMessage(user: UserI)
	{
		const newRoom: RoomI = {
			ownerId: parseInt(this.userId),
			name: `DM from ${user.nick}`,
			password: "",
			option: "Direct",
			users: [user]
		}
		this.chatService.createRoom(newRoom);
	}

	blockUser(userBlock: UserI)
	{
		console.log("BLOCK!!")
		this.chatService.blockUser(userBlock.id.toString())
	}

	UnblockUser(user: UserI)
	{
		console.log("UNBLOCK")
		this.chatService.unLockUser(user.id.toString())
	}

	UserBanned(user: UserI)
	{
		console.log("BANNED!!")
		this.chatService.userBanned(user)
	}
}
