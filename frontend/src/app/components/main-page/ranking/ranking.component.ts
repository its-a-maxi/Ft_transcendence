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

  allUsers: User[] | undefined;

  async ngOnInit()
  {
    let i: number = 0;
    await this.authService.showAllUsers()
      .then(response => this.allUsers = response.data);
    this.rankByWins();
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
      while (j >= 0 && this.allUsers[j].wins < temp.wins)
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
      while (j >= 0 && this.allUsers[j].defeats < temp.defeats)
      {
        this.allUsers[j + 1] = this.allUsers[j];
        j--;
      }
      this.allUsers[j + 1] = temp;
    }
  }

}
