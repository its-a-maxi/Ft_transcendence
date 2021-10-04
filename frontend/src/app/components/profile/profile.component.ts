import { stringify } from '@angular/compiler/src/util';
import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { User } from '../../services/models/user';
import { Form, NgForm } from "@angular/forms";
import { NavigationComponent } from '../navigation/navigation.component';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

interface HtmlImputEvent extends Event
{
	target: HTMLInputElement & EventTarget
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit
{

	nick: string = ""
	userEmail: string = ""
	userAvatar: string = ""
	newNick: string = ""
	newEmail: string = ""
	userId: number = 0
	paramId: string = ""
	check: boolean = false
	authChoice:boolean = false
	imageSelected: string | ArrayBuffer | undefined;
	files: File | undefined;
	oldAvatar!: string

	paramsNav: any = {
		idNav: this.paramId,
		userNick: this.nick,
		userAvatar: this.userAvatar
	}
 
	constructor(public authService: AuthService,
				private router: Router,
				private activateRoute: ActivatedRoute) { }

	ngOnInit(): void
	{
		//this.showUsers()
		this.paramId = this.activateRoute.snapshot.paramMap.get('id')?.substr(0, 5)!
		sessionStorage.setItem('token', this.paramId)
		this.findUser()
	}

	// showUsers()
	// {
	// 	this.authService.showAllUsers()
	// 		.then(res => res.data.map(obj => console.log(obj)))
	// }

	findUser()
	{
		
		this.authService.getUserById(this.paramId)
			.then(res => {
				if (res.data === "ERROR!!")
				{
					this.authService.logOutUser(false)
					this.router.navigate(['/login'])
				}
				else
				{
					this.nick = res.data.nick
					this.userEmail = res.data.email
					this.userAvatar = res.data.avatar
					this.oldAvatar = this.userAvatar.substring(34)
					this.paramsNav = {
						idNav: this.paramId,
						userNick: this.nick,
						userAvatar: this.userAvatar
					}
				}
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
		if (!this.enableTwoFactor(this.authChoice))
			return
		if (this.check)
		{
			this.authService.createAvatar(this.files).then(() => this.newNick = "")
		}
		const updateUser: User = new User()
		updateUser.authentication = this.authChoice
		updateUser.nick = this.newNick
		updateUser.email = this.newEmail
		updateUser.id = parseInt(this.paramId)
		updateUser.avatar = !this.files?.name! ?
				this.oldAvatar : this.files?.name!
		this.authService.updateUser(updateUser)
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
