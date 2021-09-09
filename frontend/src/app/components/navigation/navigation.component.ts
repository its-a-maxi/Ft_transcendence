import { ChangeDetectionStrategy, Component, DoCheck, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from 'dotenv';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit
{
	@Input() params!: any

	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
	
	}

	getPlay()
	{
		if (localStorage.getItem('nick'))
			this.router.navigate(['/game'])
		else
			this.router.navigate(['/login'])
	}

	reload()
	{
		console.log("dentro")
	}
}
