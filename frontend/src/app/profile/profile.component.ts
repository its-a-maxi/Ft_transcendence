import { stringify } from '@angular/compiler/src/util';
import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../services/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	image: any;
	nick: string | null = localStorage.getItem('nick')


	constructor(public authService: AuthService) { }

	ngOnInit(): void {

		if (this.authService.getAuthUser() === undefined)
			this.image = ""
		if (localStorage.getItem('nick') !== null)
			this.authService.getUserID(this.nick)
	}


}
