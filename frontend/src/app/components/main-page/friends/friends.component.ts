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
  notFriendsSearch: Array<User> = [];
  private notFriends: Array<User> = [];
  private allUsers: Array<User> = [];

  searchInput: string = "";

  async ngOnInit()
  {
    await this.authService.getAuthUser()
      .then(response => this.mainUser = response.data);
    if (this.mainUser && this.mainUser.friends)
      this.friends = this.mainUser.friends;
    this.sortConnected();
    await this.authService.showAllUsers()
      .then(response => this.allUsers = response.data.filter(x => x.id != this.mainUser?.id));
    
    let lapin: User = new User;
    lapin.nick = 'Lapin';
    lapin.name = 'lhare-c';
    let mr: User = new User;
    mr.nick = 'Mr. Robbinson';
    mr.name = 'arobbinson';
    mr.isConnected = true;
    let ma: User = new User;
    ma.nick = 'Mahey';
    ma.name = 'mvelazquez';
    let la: User = new User;
    la.nick = 'Alex';
    la.name = 'aleon-ca';
    this.allUsers.push(lapin);
    this.allUsers.push(mr);
    this.allUsers.push(ma);
    this.allUsers.push(la);
    this.allUsers.push(la);
    this.allUsers.push(la);
    this.allUsers.push(la);
    this.allUsers.push(la);
    
  }

  async addFriend(newFriend: User)
  {
    this.friends.push(newFriend);
    this.sortConnected();
    this.closeOverlay();
  }

  async deleteFriend(exFriend: User)
  {
    let rst: Array<User> = []
    for(let i = 0; this.friends[i]; i++)
      if (this.friends[i] != exFriend)
        rst.push(this.friends[i]);
    this.friends = rst;
    this.sortConnected();
  }

  openUser(user: string): void
  {
    window.open("https://profile.intra.42.fr/users/" + user);
  }

  showOverlay() : void
  {
    this.getNotFriends();
    this.notFriendsSearch = this.notFriends;
    
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let overlay = document.getElementById("overlay");
    let btn = document.getElementById("addFriend");
    container!.style.opacity = "50%";
    overlayBack!.style.display = "block";
    overlay!.style.opacity = "100%";
    overlay!.style.height = "80%";
    overlay!.style.width = "46vh";
    btn!.style.opacity = "50%";
  }

  closeOverlay() : void
  {
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let overlay = document.getElementById("overlay");
    let btn = document.getElementById("addFriend");
    container!.style.opacity = "100%";
    overlayBack!.style.display = "none";
    overlay!.style.opacity = "0%";
    overlay!.style.height = "0vh";
    overlay!.style.width = "0vh";
    btn!.style.opacity = "100%";
  }

  showAtSearch()
  {
    this.notFriendsSearch = [];
    let filter = this.searchInput.toUpperCase();

    for (let i = 0; this.notFriends[i]; i++)
    {
      let txtValue = this.notFriends[i].name + this.notFriends[i].nick;
      if (txtValue.toUpperCase().indexOf(filter) > -1)
        this.notFriendsSearch.push(this.notFriends[i]);
    }
  }

  private sortConnected(): void
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

  private getNotFriends()
  {
    this.notFriends = [];
    for (let i = 0; this.allUsers[i]; i++)
    {
      let j : number;
      for (j = 0; this.friends[j]; j++)
        if (this.friends[j] == this.allUsers[i])
          break;
      if (!this.friends[j])
        this.notFriends.push(this.allUsers[i]);
    }
  }

}
