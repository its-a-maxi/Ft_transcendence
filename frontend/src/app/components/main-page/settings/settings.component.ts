import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/models/user';

interface HtmlInputEvent extends Event
{
	target: HTMLInputElement & EventTarget
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private user?: User;
	private files: File | undefined;

  oldNick: string = "default";
  oldEmail: string = "default";
  oldPhone: string = "default";
  oldAuthentication: boolean = false;

  nick: string = "";
  email: string = "";
  phone: string = "";
  authentication: boolean = false;
	profilePicture: string | ArrayBuffer | undefined = "";

  private check: boolean = false;


  constructor(public authService: AuthService, private router: Router) { }

  async ngOnInit() {
    await this.authService.getAuthUser()
    .then(response => this.user = response.data);
    if (this.user)
    {
      this.oldNick = this.user.nick;
      this.oldEmail = this.user.email;
      this.oldPhone = this.user.phone;
    }
    if (this.user?.authentication)
    {
      this.oldAuthentication = this.user.authentication;
      this.authentication = this.user.authentication;
    }
    this.profilePicture = this.user?.avatar;
  }

	onImageSelected(event: any): void
	{
		if (<HtmlInputEvent>event.target.files &&
			<HtmlInputEvent>event.target.files[0])
		{
			this.files = <File>event.target.files[0];
			const reader = new FileReader();
			reader.onload = e => this.profilePicture = reader.result!;
			reader.readAsDataURL(this.files);
      this.check = true;
		}
	}

  validateEmail(email: string)
  {
    let check = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(check))
      return true; 
    else
      return false;
  }

  validatePhone(phone: string)
  {
    let check = /^\d{9}$/;
    if(phone.match(check))
      return true;
    else
      return false;
  }

  async uploadNewSettings()
  {
    if (this.nick.length > 0 && this.nick.length < 4)
      alert("Please, check that your nickname has at least 4 characters")
    else if (this.email.length > 0 && !this.validateEmail(this.email))
      alert("Please, input a valid e-mail")
    else if (this.phone.length > 0 && !this.validatePhone(this.phone))
      alert("Please, input a valid phone number")
    else if (this.user)
    {
      if (this.check)
      {
        await this.authService.createAvatar(this.files);
        this.user.avatar = this.files?.name;
      }
      else
        this.user.avatar = this.user.avatar?.substring(34);
      if (this.nick != "")
        this.user.nick = this.nick;
      if (this.email != "")
        this.user.email = this.email;
      if (this.phone != "")
        this.user.phone = this.phone;
      this.user.authentication = this.authentication;
      await this.authService.updateUser(this.user);
      if (this.user.authentication != this.oldAuthentication && this.user.authentication)
        this.router.navigate(['/twofa']);
      else
        window.location.reload();
      return;
    }
  }
}
