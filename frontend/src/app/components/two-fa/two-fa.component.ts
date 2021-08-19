import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.css']
})
export class TwoFAComponent implements OnInit {

  	phone: string = ""
	code: string = ""

	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{

	}

  	verifyNumber(form: NgForm)
	{
		if (this.phone)
			this.authService.twoFactor(form.value)
		else
			alert("You need write your phone number!")
	}

	verifyCode(form: NgForm)
	{
		if (this.code && this.code.length == 4 && this.phone)
		{
			this.authService.verifyCode(form.value)
			//form.reset()
			//this.router.navigate(['/home'])
		}
		else
			alert("You need write your phone number and sms code!")
	}

}
