import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userInfo } from 'os';
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
  toChangeRoom!: RoomI;
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
    if (room.option == "private" && room.ownerId.toString() != this.paramId)
    {
      this.toChangeRoom = room;
      this.showOverlay("password");
    }
    else
      this.currentRoom = room;
  }

  ifPassword(check :boolean)
  {
    if (check)
      this.currentRoom = this.toChangeRoom;
    this.closeOverlay();
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

	showOverlay(type: string): void
	{
		let container = document.getElementById("container");
		let overlayBack = document.getElementById("overlayBack");
		let popup = document.getElementById("popup");
    let password = document.getElementById("password");
    let hiddenUserList = document.getElementById("hiddenUserList");
    let hiddenChannelList = document.getElementById("hiddenChannelList");

		container!.style.opacity = "50%";
		overlayBack!.style.display = "block";
    if (type == "newChannel")
		  popup!.style.display = "block";
    else if (type == "password")
      password!.style.display = "block";
    else if (type == "hiddenUserList")
      hiddenUserList!.style.display = "block";
    else if (type == "hiddenChannelList")
      hiddenChannelList!.style.display = "block";
	}

	closeOverlay(): void
	{
		let container = document.getElementById("container");
		let overlayBack = document.getElementById("overlayBack");
		let popup = document.getElementById("popup");
    let password = document.getElementById("password");
    let hiddenUserList = document.getElementById("hiddenUserList");
    let hiddenChannelList = document.getElementById("hiddenChannelList");
    
		container!.style.opacity = "100%";
		overlayBack!.style.display = "none";
		popup!.style.display = "none";
		password!.style.display = "none";
    hiddenUserList!.style.display = "none";
    hiddenChannelList!.style.display = "none";
	}

	blockUser(user: UserI)
	{
    if (user.isBlocked == true)
    {
      this.chatService.unLockUser(user.id.toString())
      user.isBlocked = false;
    }
    else
    {
		  this.chatService.blockUser(user.id.toString())
      user.isBlocked = true;
    }
	}

}
