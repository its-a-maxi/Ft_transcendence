import { stringify } from '@angular/compiler/src/util';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/models/user';
import { Form, NgForm } from "@angular/forms";
import { NavigationComponent } from '../navigation/navigation.component';

interface HtmlImputEvent extends Event
{
	target: HTMLInputElement & EventTarget
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	nick: string = ""
	userId: number = 0
	imageSelected: string | ArrayBuffer | undefined;
	files: File | undefined;

	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.authService.getAuthUser()
			.then(() => this.getNick())
			.catch(() => this.router.navigate(['login']))
	}

	getNick()
	{
		this.authService.getAuthUser()
			.then(res => res.data)
			.then(obj => {
				this.nick = obj.nick
				this.userId = obj.id
				localStorage.setItem('nick', this.nick as string)
			})
	}

	onImageSelected(event: any)
	{
		if (<HtmlImputEvent>event.target.files &&
			<HtmlImputEvent>event.target.files[0])
		{
			this.files = <File>event.target.files[0]
			const reader = new FileReader()
			reader.onload = e => this.imageSelected = reader.result!
			reader.readAsDataURL(this.files)

		}
	}

	uploadImage(form: Form)
	{
		localStorage.removeItem('nick')
		localStorage.setItem('nick', this.nick)
		NavigationComponent.updateUserStatus.next(true)
		this.authService.createAvatar(this.files)
		const updateUser: User = new User()
		updateUser.nick = this.nick
		updateUser.id = this.userId
		updateUser.avatar = this.files?.name!
		this.authService.updateUser(updateUser)		
	}
}
