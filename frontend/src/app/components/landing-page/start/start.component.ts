import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.showUsers()
		
	}

	showUsers()
	{
		this.authService.showAllUsers()
			.then(res => res.data.map(obj => console.log(obj)))
	}

	getPlay()
	{
		window.location.href = "http://localhost:3000/auth/callback";
	}
}
