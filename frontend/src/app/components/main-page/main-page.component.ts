import { Component, OnInit, Query } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/Account';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/models/user';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  private tabsText: any;
  private hamburger: any;
  private profile: any;
  private bottom: any;
  private content: any;

  private clicked: boolean = false;

  private user?: User;
  nick: string | undefined;
  name: string | undefined;
  picture: string | ArrayBuffer | undefined;
  liveUsers = "42"; 

  async ngOnInit() {
    await this.authService.getAuthUser()
    .then(response => console.log(this.user = response.data))
    this.tabsText = document.getElementById("tabsText");
    this.hamburger = document.getElementById("hamburger");
    this.profile = document.getElementById("profile");
    this.bottom = document.getElementById("bottom");
    this.content = document.getElementById("content");
    this.nick = this.user?.nick;
    this.name = this.user?.name;
    this.picture = this.user?.avatar;
  }

  private openNav(): void
  {
    this.tabsText!.style.left = "0%";
    this.hamburger!.style.backgroundImage = 'url("../../../assets/images/back.png")';
    this.profile!.style.display = "none";
    this.bottom!.style.display = "none";
    this.content!.style.display = "none";
    return;
  }

  private closeNav(): void
  {
    this.tabsText!.style.left = "-150%";
    this.hamburger!.style.backgroundImage = 'url("../../../assets/images/hamburger.png")';
    this.profile!.style.display = "block";
    this.bottom!.style.display = "block";
    this.content!.style.display = "block";
    return;
  }

  public clickTab(): void
  {
    if (this.clicked == true)
    {
      this.closeNav();
      this.clicked = false;
    }
    return;
  }

  public clickNav(): void
  {
    if (this.clicked == false)
    {
      this.openNav();
      this.clicked = true;
    }
    else
    {
      this.closeNav();
      this.clicked = false;
    }
    return;
  }

}
