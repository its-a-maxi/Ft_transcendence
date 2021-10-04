import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat-service';
import { RoomI } from 'src/app/services/models/room.interface';
import { User } from 'src/app/services/models/user';
import { UserI } from 'src/app/services/models/user.interface';
import { ChatPageComponent } from '../chat-page.component';

@Component({
	selector: 'app-create-room',
	templateUrl: './create-room.component.html',
	styleUrls: ['./create-room.component.css']
})

export class CreateRoomComponent implements OnInit
{

	constructor(private authService: AuthService, private chatService: ChatService, private router: Router) { }

	name: string = "";
	password: string = "";
	check: boolean = false;

	private mainUser: UserI | undefined;
	private allUsers: Array<UserI> = [];
	private rooms: Array<RoomI> = [];

	private paramId: string | null = sessionStorage.getItem('token');

	@Output('closeOverlay') closeOverlay: EventEmitter<any> = new EventEmitter();


	async ngOnInit() {
		if (this.paramId)
			await this.findUser(this.paramId);
		await this.findRooms();
        //this.authService.showUsers_test().subscribe(response => this.allUsers = response.filter(x => x.id != this.mainUser?.id))
		await this.authService.showAllUsers()
			.then(response => this.allUsers = response.data.filter(x => x.id != this.mainUser?.id));
	}

	async findUser(id: string) {
		await this.authService.getUserById(id)
			.then(res => {
				if (res.data === "ERROR!!") {
					this.authService.logOutUser(false)
					this.router.navigate(['/landingPage/start'])
				}
				else
					this.mainUser = res.data;
			})
	}

	private async findRooms() {
		this.chatService.findMyRooms();
		this.chatService.getMyRooms().subscribe(res => {
			this.rooms = res;
		})
	}

	createNewChannel() {
		if (!this.checkInputs())
			return;

		let users: Array<UserI> = [];
		let admins: Array<UserI> = [];

		admins.push(this.mainUser!);
		for (let i = 0; this.allUsers[i]; i++)
			users.push(this.allUsers[i]);
		let newRoom = {
			name: '#' + this.name.toLowerCase(),
			option: "public",
			password: this.password,
			users: users,
			ownerId: this.mainUser!.id,
			admins: admins
		}
		if (this.password != "")
			newRoom.option = "private";
		console.log(newRoom);
		this.chatService.createRoom(newRoom);
		this.closeOverlay.emit();
	}

	private checkInputs(): boolean {
		let check = /^[a-zA-Z0-9-]+$/;

		if (this.name == "")
			alert("Please, provide a name");
		else if (!this.name.match(check)) {
			alert("Please, use valid characters for your channel name");
			this.name = "";
		}
		else if (this.checkRepeatedChannels()) {
			alert("Channel name already in use");
			this.name = "";
		}
		else if (!this.password.match(check) && this.password != "") {
			alert("Please, use valid characters for your channel password");
			this.password = "";
		}
		else
			return (true);
		return (false);
	}

	private checkRepeatedChannels(): boolean {
		for (let i = 0; this.rooms[i]; i++)
			if (this.rooms[i].name == '#' + this.name.toLowerCase())
				return (true);
		return (false);
	}

}
