import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { User } from 'src/app/services/models/user';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  mainUser: UserI | undefined;
  friends: Array<UserI> = [];
  notFriendsSearch: Array<UserI> = [];
  private notFriends: Array<UserI> = [];
  private allUsers: Array<UserI> = [];

  searchInput: string = "";

  paramId: string | null = sessionStorage.getItem('token');

  userPopup?: UserI;

  async ngOnInit()
  {
    if (this.paramId)
      await this.findUser(this.paramId);
    //this.authService.showUsers_test().subscribe(response => this.allUsers = response.filter(x => x.id != parseFloat(this.paramId!)))
    await this.authService.showAllUsers()
      .then(response => this.allUsers = response.data.filter(x => x.id != parseFloat(this.paramId!)));
    if (this.mainUser && this.mainUser.friendsId)
    {
      if (this.mainUser.friendsId == null)
        this.friends = [];
      else
        this.getFriends();
    }
    this.userPopup = this.mainUser;
    this.sortConnected();
    console.log(this.friends);
  }

	async findUser(id: string)
	{	
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

  async addFriend(newFriend: UserI)
  {
    this.friends.push(newFriend);
    this.authService.updateFriends(this.friends, this.paramId!);
    this.sortConnected();
    this.closeOverlay();
  }

  async deleteFriend(exFriend: UserI)
  {
    let rst: Array<UserI> = []
    for(let i = 0; this.friends[i]; i++)
      if (this.friends[i] != exFriend)
        rst.push(this.friends[i]);
    this.friends = rst;
    this.authService.updateFriends(this.friends, this.paramId!);
    this.sortConnected();
  }

  openUser(user: string): void
  {
    window.open("https://profile.intra.42.fr/users/" + user);
  }

  showOverlay(type: string, user?: UserI) : void
  {
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let overlay = document.getElementById("overlay");
    let profilePopup = document.getElementById("profilePopup");
    let btn = document.getElementById("addFriend");
    container!.style.opacity = "50%";
    btn!.style.opacity = "50%";
    overlayBack!.style.display = "block";
    if (type == 'friendPopup')
    {
      this.getNotFriends();
      this.notFriendsSearch = this.notFriends;
      overlay!.style.opacity = "100%";
      overlay!.style.height = "80%";
      overlay!.style.width = "46vh";
    }
    else if (type == 'profilePopup')
    {
      this.userPopup = user;
      profilePopup!.style.display = 'block';
    }
      
  }

  closeOverlay() : void
  {
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let overlay = document.getElementById("overlay");
    let btn = document.getElementById("addFriend");
    let profilePopup = document.getElementById("profilePopup");
    container!.style.opacity = "100%";
    overlayBack!.style.display = "none";
    overlay!.style.opacity = "0%";
    overlay!.style.height = "0vh";
    overlay!.style.width = "0vh";
    btn!.style.opacity = "100%";
    profilePopup!.style.display = 'none';
  }

  showAtSearch()
  {
    this.notFriendsSearch = [];
    let filter = this.searchInput.toUpperCase();

    for (let i = 0; this.notFriends[i]; i++)
    {
      let txtValue = this.notFriends[i].nick;
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
      while (j >= 0 && temp.status == "online")
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

  private getFriends()
  {
    this.friends = [];
    if (this.mainUser?.friendsId)
      for (let i = 0; this.allUsers[i]; i++)
      {
        let j : number;
        for (j = 0; this.mainUser.friendsId[j]; j++)
          if (this.mainUser.friendsId[j] == this.allUsers[i].id)
          {
            this.friends.push(this.allUsers[i]);
            break;
          }
      }
  }

  getWinToLossRatio(user: UserI)
  {
    if (user.wins == 0 && user.defeats == 0)
      return ('None');
    else if (user.defeats == 0)
      return (100);
    else if (user.wins == 0)
      return (0);
    else
      return ((user.wins! / user.defeats!).toFixed(2))
  }

}
