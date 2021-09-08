import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from "@angular/forms";
import { NavigationComponent } from '../navigation/navigation.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.router.navigate(['/landingPage/registration']).finally(() => {window.location.reload()})
		this.authService.getAuthUser()
			.catch(() => this.router.navigate(['login']))

	}

	userRegister(form: NgForm)
	{
		let i = 0
		while (form.value['nick'][i])
			i++;
		if (i < 4)
		{
			alert('Choose a Nick Name with at least 4 letters')
			return
		}
		NavigationComponent.updateUserStatus.next(true)
		this.authService.postAuthUser(form.value).then(() => ProfileComponent.oldAvatar.next("ryu.jpg"))
		localStorage.setItem('nick', form.value['nick'])
		localStorage.setItem('avatar', "ryu.jpg")
		form.reset()
		this.router.navigate(['/mainPage/play']).finally(() => {window.location.reload()})
		
	}

}
