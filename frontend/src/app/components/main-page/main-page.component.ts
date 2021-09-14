import { Component, OnInit, Query } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
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
  picture: string | ArrayBuffer | undefined;
  liveUsers: number = 0;

  paramId: string | null = sessionStorage.getItem('token');

  async ngOnInit() {
    if (this.paramId)
      await this.findUser(this.paramId);
    this.getConnectedUsers();
    this.nick = this.user?.nick;
    this.picture = this.user?.avatar;
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
					this.user = res.data;
			})
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
      .then(response => users = response.data)
    for(let i = 0; users[i]; i++)
      //if (users[i].isConnected == true)
        this.liveUsers++;
    return;
  }

}
