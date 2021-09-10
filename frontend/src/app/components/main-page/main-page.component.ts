import { Component, OnInit, Query } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/models/user';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  private user?: User;
  nick: string | undefined;
  name: string | undefined;
  picture: string | ArrayBuffer | undefined;
  liveUsers: number = 0; 

  async ngOnInit() {
    await this.authService.getAuthUser()
      .then(response => console.log(this.user = response.data))
    if (!this.user)
      this.router.navigate(['/landingPage/start']);
    this.getConnectedUsers();
    this.nick = this.user?.nick;
    this.name = this.user?.name;
    this.picture = this.user?.avatar;
  }

  showTabs() : void
  {
    let container = document.getElementById("all");
    let pageBack = document.getElementById("pageBack")
    let hiddenTabs = document.getElementById("hiddenTabs")
    container!.style.opacity = "50%";
    pageBack!.style.display = "block";
    hiddenTabs!.style.left = "-10vh";
  }

  hideTabs() : void
  {
    let container = document.getElementById("all");
    let pageBack = document.getElementById("pageBack")
    let hiddenTabs = document.getElementById("hiddenTabs")
    container!.style.opacity = "100%";
    pageBack!.style.display = "none";
    hiddenTabs!.style.left = "-100vw";
  }

  private async getConnectedUsers()
  {
    let users: Array<User> = [];
    await this.authService.showAllUsers()
      .then(response => console.log(users = response.data))
    for(let i = 0; users[i]; i++)
      if (users[i].isConnected == true)
        this.liveUsers++;
    return;
  }

}
