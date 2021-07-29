import { stringify } from '@angular/compiler/src/util';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	nick: string = ""

	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.authService.getAuthUser()
			.then(() => this.getNick())
			.catch(() => this.router.navigate(['login']))
	}

	getNick()
	{
		this.authService.getAuthUser()
			.then(res => res.data.nick)
			.then(obj => {
				this.nick = obj
				localStorage.setItem('nick', this.nick as string)
			})
	}

}
