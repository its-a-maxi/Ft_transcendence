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
	userEmail: string = ""
	userPhone: string = ""
	userAvatar: string = ""
	newNick: string = ""
	newEmail: string = ""
	newPhone: string = ""
	userId: number = 0
	check: boolean = false
	authChoice:boolean = false
	imageSelected: string | ArrayBuffer | undefined;
	files: File | undefined;
	public static oldAvatar: Subject<string> = new Subject()

	constructor(public authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.router.navigate(['/mainPage/play']).finally(() => {window.location.reload()})
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
				this.userEmail = obj.email
				this.userPhone = obj.phone
				this.userAvatar = ""//obj.avatar.substring(34)
				localStorage.setItem('nick', this.nick as string)
				localStorage.setItem('avatar', this.userAvatar)
			})
	}

	onImageSelected(event: any): void
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

	uploadImage(): void
	{
		if (this.newNick.length == 0)
			this.newNick = this.nick
		else if (this.newNick.length > 0 && this.newNick.length < 4)
		{
			alert("Choose a Nick Name with at least 4 letters")
			return
		}
		if (this.newEmail.length == 0)
			this.newEmail = this.userEmail
		if (this.newPhone.length == 0)
			this.newPhone = this.userPhone
		if (!this.enableTwoFactor(this.authChoice))
			return
		if (this.check)
		{
			NavigationComponent.updateUserStatus.next(true)
			this.authService.createAvatar(this.files).then(() => this.newNick = "")
		}
		const updateUser: User = new User()
		updateUser.authentication = this.authChoice
		updateUser.nick = this.newNick
		updateUser.email = this.newEmail
		updateUser.phone = this.newPhone
		updateUser.id = this.userId
		updateUser.avatar = this.files?.name//! ?
			//localStorage.getItem('avatar')! : this.files?.name!
		this.authService.updateUser(updateUser)
			//.then(() => localStorage.setItem('avatar', updateUser.avatar))
			.then(() => {
				if (this.authChoice)
					this.router.navigate(['/twofa'])
			})
			.finally(() => window.location.reload())
	}

	enableTwoFactor(choice: boolean): boolean
	{
		if (choice)
		{
			const option = confirm("Are you sure to enable Two Factor Authentication?")
			if (!option)
				return false
		}
		else if (!choice)
		{
			const option = confirm("Are you sure to disable Two Factor Authentication?")
			if (!option)
				return false
		}
		return true
	}
}
