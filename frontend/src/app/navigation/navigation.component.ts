import { Component, DoCheck, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, DoCheck {


	state: boolean = false
	nick: string | null = this.authService.statusLogin() ? localStorage.getItem('nick') : ""
	public static updateUserStatus: Subject<boolean> = new Subject()
	avatar: any
	id: any


	constructor(public authService: AuthService) { }

	ngOnInit(): void
	{
		NavigationComponent.updateUserStatus.subscribe(
			res => {this.nick = localStorage.getItem('nick')})
			
		if (this.authService.getAuthUser() === undefined)
			this.state = false
		else
		{
			
			this.authService.getAuthUser()
			.then(res => res.data)
			.then(obj => {
				this.avatar = obj.avatar
				
			})
		
		}
		
	}

	ngDoCheck(): void
	{
		if (!this.authService.statusLogin())
			this.state = false
		else
			this.state = true
	}

}
