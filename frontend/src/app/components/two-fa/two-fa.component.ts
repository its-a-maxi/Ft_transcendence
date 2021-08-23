import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgForm } from "@angular/forms";
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.css']
})
export class TwoFAComponent implements OnInit {

  	phone: string = ""
	code: string = ""
	userPhone: string = ""
	userEmail: string = ""
	qrImage: string = ""

	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.getQrCode()
	}

  	getQrCode()
	{
		this.authService.twoFactor().then(res => this.qrImage =res.data.url)
	}

	verifyCode(form: NgForm)
	{
		this.authService.verifyCode(form.value)
			.then((res) => {
				alert('2 Factor Authentication Success!!')
				localStorage.setItem('nick', res.data.nick)
				form.reset()
				this.router.navigate(['/home'])})
			.catch(() => {
				alert('2 Factor Authentication Failure!!')
			})
	}

}
