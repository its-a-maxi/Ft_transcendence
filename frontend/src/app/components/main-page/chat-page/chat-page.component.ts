import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat-service';
import { RoomI } from 'src/app/services/models/room.interface';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  constructor(private chatService: ChatService, private authService: AuthService, private router: Router) { }

  mainUser!: UserI;
  paramId: string | null = sessionStorage.getItem('token');

  allUsers: Array<UserI> = [];

  currentRoom!: RoomI;
	rooms: Array<RoomI> = [];
	users: Array<RoomI> = [];
	channels: Array<RoomI> = [];

  async ngOnInit()
  {
    if (this.paramId)
      await this.findUser(this.paramId);
    await this.authService.showAllUsers()
      .then(response => this.allUsers = response.data.filter(x => x.id != this.mainUser?.id));
    await this.findRooms();
  }

  private async findUser(id: string)
  {	
    await this.authService.getUserById(id)
      .then(res => {
        if (res.data === "ERROR!!")
        {
          this.authService.logOutUser(false)
          this.router.navigate(['/landingPage/start'])
        }
        else
          this.mainUser = res.data;
      })
  }

	private async findRooms()
	{
		this.chatService.findMyRooms();
	  this.chatService.getMyRooms().subscribe(res => {
      this.rooms = res;
      this.sortRooms();
    })
	}

  private sortRooms()
  {
    this.channels = [];
    this.users = [];
    for (let i = 0; this.rooms[i]; i++)
    {
      if (this.rooms[i].name[0] == '#')
        this.channels.push(this.rooms[i]);
      else
        this.users.push(this.rooms[i]);
    }
  }

  changeCurrentRoom(room: RoomI)
  {
    this.currentRoom = room;
  }

	directMessage(user: UserI)
	{
    let cmp1, cmp2: string;
    cmp1 = this.mainUser.id.toString() + '/' + user.id.toString();
    cmp2 = user.id.toString() + '/' + this.mainUser.id.toString();
    for (let i = 0; this.users[i]; i++)
    {
      if (this.users[i].name == cmp1 || this.users[i].name == cmp2)
      {
        this.changeCurrentRoom(this.users[i]);
        return;
      }
    }
    console.log('new room created');
		const newRoom: RoomI = {
			ownerId: parseInt(this.paramId!),
			name: this.mainUser.id + '/' + user.id,
			password: "",
			option: "Direct",
			users: [user]
		}
		this.chatService.createRoom(newRoom);
	}

}
