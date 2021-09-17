import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat-service';
import { UserI } from 'src/app/services/models/user.interface';


@Component({
	selector: 'app-chat',
	templateUrl: './chat.component.html',
	styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit
{
	nick: string = ""
	userAvatar: string = ""
	paramId: string = ""
	paramsNav: any = {
		idNav: this.paramId,
		userNick: this.nick,
		userAvatar: this.userAvatar
	}

	form: FormGroup = new FormGroup({
		ownerId: new FormControl(null),
		name: new FormControl(null, [Validators.required]),
		password: new FormControl(null, [Validators.required]),
		option: new FormControl('public', [Validators.required]),
		users: new FormControl(null)
	});

	userId!: number;
	usersConnected!: UserI[]

	constructor(private authService: AuthService,
				private chatService: ChatService,
				private router: Router,
				private activateRoute: ActivatedRoute
				) { }

	ngOnInit(): void
	{
		this.paramId = this.activateRoute.snapshot.paramMap.get('id')?.substr(0, 5)!
		this.userId = parseInt(this.paramId)
		this.chatService.findUsersConnected()
		this.chatService.getConnectedUsers().subscribe(res => {
			this.usersConnected = res
			console.log(this.usersConnected)
		})
		
	}

	ngOnDestroy()
	{
		window.location.reload()
	}

	ngAfterViewInit()
	{

	}

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
					this.userAvatar = res.data.avatar
					this.paramsNav = {
						idNav: this.paramId,
						userNick: this.nick,
						userAvatar: this.userAvatar
					}
				}
			})
	}

	create()
	{
		if (this.form.valid)
		{
			let listUser: UserI[] = []
			for (let user of this.usersConnected)
			{
				if (user.id !== this.userId)
					listUser.push(user)
			}
			this.form.patchValue({ ownerId: this.userId, users: listUser})
			this.chatService.createRoom(this.form.getRawValue());
			//window.location.reload()
			//this.router.navigate(['../dashboard'], { relativeTo: this.activatedRoute });
		}
	}

	get id(): FormControl
	{ 
		return this.form.get('id') as FormControl
	}

	get name(): FormControl
	{
		return this.form.get('name') as FormControl;
	}

	get password(): FormControl
	{
		return this.form.get('password') as FormControl;
	}

	get option(): FormControl
	{
		return this.form.get('option') as FormControl;
	}
}
