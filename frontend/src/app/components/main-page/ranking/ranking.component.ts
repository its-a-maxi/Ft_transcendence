import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/models/user';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  private users: User[] | undefined;

  async ngOnInit()
  {
    let i: number = 0;
    await this.authService.showAllUsers()
      .then(response => this.users = response.data);
    while (this.users && this.users[i])
      console.log(this.users[i++]);
  }

}
