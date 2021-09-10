import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/models/user';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  mainUser: User | undefined;
  friends: Array<User> = [];

  async ngOnInit()
  {
    let i: number = 0;
    await this.authService.getAuthUser()
      .then(response => this.mainUser = response.data);
    if (this.mainUser && this.mainUser.friends)
      this.friends = this.mainUser.friends;
    this.sortConnected();
  }

  sortConnected(): void
  {
    for (let i = 1; this.friends && this.friends[i]; i++)
    {
      let j = i - 1;
      let temp = this.friends[i];
      while (j >= 0 && temp.isConnected == true)
      {
        this.friends[j + 1] = this.friends[j];
        j--;
      }
      this.friends[j + 1] = temp;
    }
  }

  async addFriend()
  {
    if (this.mainUser)
    {
      this.friends.push(this.mainUser);  
      //await this.authService.updateUser(this.mainUser);
    }
    //window.location.reload();
  }

}
