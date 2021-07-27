import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.showUsers()
		if (this.authService.getAuthUser() === undefined)
			this.router.navigate(['/home'])

	}

	userRegister(form: NgForm)
	{
		this.authService.postAuthUser(form.value);
		form.reset()
	}

	showUsers()
	{
		this.authService.showAllUsers()
		.then(res => res.data.map(obj => console.log(obj)))
	}

}
