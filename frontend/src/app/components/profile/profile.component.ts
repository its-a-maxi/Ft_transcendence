import { stringify } from '@angular/compiler/src/util';
import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../services/models/user';
import { Form, NgForm } from "@angular/forms";
import { NavigationComponent } from '../navigation/navigation.component';
import { Subject } from 'rxjs';

interface HtmlImputEvent extends Event
{
	target: HTMLInputElement & EventTarget
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, DoCheck {

	nick: string = ""
	newNick: string = ""
	userId: number = 0
	check: boolean = false
	imageSelected: string | ArrayBuffer | undefined;
	files: File | undefined;
	public static oldAvatar: Subject<string> = new Subject()

	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		if (!localStorage.getItem('avatar'))
			ProfileComponent.oldAvatar.subscribe((res) => 
				localStorage.setItem('avatar', res))
		
		this.authService.getAuthUser()
			.then(() => this.getNick())
			.catch(() => this.router.navigate(['login']))
	}

	ngDoCheck()
	{
		
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
			this.check = true
		}
	}

	uploadImage()
	{
		if (this.newNick.length == 0)
			this.newNick = this.nick
		else if (this.newNick.length > 0 && this.newNick.length < 4)
		{
			alert("Choose a Nick Name with at least 4 letters")
			return
		}
		if (this.check)
		{
			NavigationComponent.updateUserStatus.next(true)
			this.authService.createAvatar(this.files).then(() => this.newNick = "")
		}
		const updateUser: User = new User()
		updateUser.nick = this.newNick
		updateUser.id = this.userId
		updateUser.avatar = !this.files?.name! ?
			localStorage.getItem('avatar')! : this.files?.name!
		this.authService.updateUser(updateUser)
			.then(() => localStorage.setItem('avatar', updateUser.avatar))
			.finally(() => window.location.reload())
	}
}
