import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat-service';
import { RoomI } from 'src/app/services/models/room.interface';
import { User } from 'src/app/services/models/user';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})

export class CreateRoomComponent implements OnInit {

  constructor(private authService: AuthService, private chatService: ChatService, private router: Router) { }

  name: string = "";
  password: string = "";
  check: boolean = false;

  private mainUser: UserI | undefined;
  private allUsers: Array<User> = [];

  paramId: string | null = sessionStorage.getItem('token');

  async ngOnInit()
  {
    if (this.paramId)
      await this.findUser(this.paramId);
    await this.authService.showAllUsers()
      .then(response => this.allUsers = response.data.filter(x => x.id != this.mainUser?.id));
  }

	async findUser(id: string)
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

  createNewChannel()
  {
    let users: Array<UserI> = [];

    for (let i = 0; this.allUsers[i]; i++)
      users.push(this.allUsers[i]);
    let newRoom = {
      name: '#' + this.name,
      option: "public",
      password: "",
      users: users,
      ownerId: this.mainUser!.id
    }
    console.log(newRoom);
    this.chatService.createRoom(newRoom);
    
  }

}
