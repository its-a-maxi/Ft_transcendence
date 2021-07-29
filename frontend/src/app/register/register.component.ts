import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgForm } from "@angular/forms";
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.authService.getAuthUser()
			.catch(() => this.router.navigate(['login']))

	}

	userRegister(form: NgForm)
	{
		this.authService.postAuthUser(form.value)
		localStorage.setItem('nick', form.value['nick'])
		form.reset()
		NavigationComponent.updateUserStatus.next(true)
		this.router.navigate(['/profile'])
	}

}
