import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { User } from 'src/app/services/models/user';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  constructor(public authService: AuthService,
                private router: Router,
                private chatService: ChatService) { }

  allUsers: UserI[] | undefined;

  userPopup?: UserI;

  async ngOnInit()
  {
    let i: number = 0;
    await this.authService.showAllUsers()
       .then(response => this.allUsers = response.data);
    this.rankByWins();
    this.userPopup = this.allUsers![0];
    this.chatService.findUsersConnected()
  }

  openUser(user: string): void
  {
    window.open("https://profile.intra.42.fr/users/" + user);
  }

  rankByWins(): void
  {
    for (let i = 1; this.allUsers && this.allUsers[i]; i++)
    {
      let j = i - 1;
      let temp = this.allUsers[i];
      while (j >= 0 && this.allUsers[j].wins! < temp.wins!)
      {
        this.allUsers[j + 1] = this.allUsers[j];
        j--;
      }
      this.allUsers[j + 1] = temp;
    }
  }

  rankByDefeats(): void
  {
    for (let i = 1; this.allUsers && this.allUsers[i]; i++)
    {
      let j = i - 1;
      let temp = this.allUsers[i];
      while (j >= 0 && this.allUsers[j].defeats! < temp.defeats!)
      {
        this.allUsers[j + 1] = this.allUsers[j];
        j--;
      }
      this.allUsers[j + 1] = temp;
    }
  }

  rankByWL(): void
  {
    for (let i = 1; this.allUsers && this.allUsers[i]; i++)
    {
      let j = i - 1;
      let temp = this.allUsers[i];
      while (j >= 0 && (this.getWinToLossRatio(this.allUsers[j]) < this.getWinToLossRatio(temp) || this.getWinToLossRatio(this.allUsers[j]) == 'None'))
      {
        this.allUsers[j + 1] = this.allUsers[j];
        j--;
      }
      this.allUsers[j + 1] = temp;
    }
  }

  getWinToLossRatio(user: UserI): string
  {
    if (user.wins == 0 && user.defeats == 0)
      return ('None');
    else if (user.defeats == 0)
      return (user.wins!.toString());
    else if (user.wins == 0)
      return ((0).toString());
    else
      return ((user.wins! / user.defeats!).toFixed(2).toString())
  }

  async showOverlay(type: string, user?: UserI)
  {
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let profilePopup = document.getElementById("profilePopup");
    container!.style.opacity = "50%";
    overlayBack!.style.display = "block";
    if (type == 'profilePopup')
    {
      await this.authService.getUserById(user!.id.toString())
        .then(res => { this.userPopup = res.data; })
      //this.userPopup = user;
      profilePopup!.style.display = 'block';
    }
      
  }

  closeOverlay() : void
  {
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let profilePopup = document.getElementById("profilePopup");
    container!.style.opacity = "100%";
    overlayBack!.style.display = "none";
    profilePopup!.style.display = 'none';
  }

}
