import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void
  {
    if (!this.authService.statusLogin())
      this.router.navigate(['login'])
  }

}
