import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, DoCheck {


	state: boolean = false
	nick: String | null = this.authService.statusLogin() ? localStorage.getItem('nick') : ""
	public static updateUserStatus: Subject<boolean> = new Subject()
	avatar: string = ""


	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		NavigationComponent.updateUserStatus.subscribe(
			res => {this.nick = localStorage.getItem('nick')})
		
		this.getAvatar()
		
	}

	ngDoCheck(): void
	{
		if (!this.authService.statusLogin())
			this.state = false
		else
			this.state = true
	}

	getAvatar()
	{
		this.authService.getAuthUser()
			.then(res => res.data)
			.then(obj => {
				this.avatar = obj.avatar
				this.nick = obj.nick
			}).catch(() => {
					return 
				})
	}

	getPlay()
	{
		if (localStorage.getItem('nick'))
			this.router.navigate(['/game'])
		else
			this.router.navigate(['/login'])
	}
}
