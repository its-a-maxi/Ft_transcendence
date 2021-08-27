import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/Account';
import { AuthService } from 'src/app/services/auth.service';

interface HtmlImputEvent extends Event
{
	target: HTMLInputElement & EventTarget
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  account: Account = {
    user: "default",
    email: "default",
    nickname: "default",
    profilePicture: "../../../assets/images/TuxedoPenguin.jpg",
    twoFa: false
  }

  newSettings: Account = Object.assign({}, this.account);

	files: File | undefined;
	imageSelected: string | ArrayBuffer | undefined = "../../../assets/images/TuxedoPenguin.jpg";

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
		this.authService.getAuthUser()
			.then(() => this.getUser())
			.catch(() => this.router.navigate(['login']))
    this.resetSettings();
  }

	getUser()
	{
		this.authService.getAuthUser()
			.then(res => res.data)
			.then(obj => {
				this.account.nickname = obj.nick
				this.account.email = obj.email
        this.account.twoFa = obj.authentication
			})
	}

  resetSettings(): void
  {
    this.newSettings = Object.assign({}, this.account);
    this.newSettings.email = "";
    this.newSettings.nickname = "";
  }

  updateAccount(): void
  {
    if (this.newSettings.email != "")
      this.account.email = this.newSettings.email;
    if (this.newSettings.nickname != "")
      this.account.nickname = this.newSettings.nickname;
    if (this.newSettings.profilePicture != "")
      this.account.profilePicture = this.newSettings.profilePicture;
      if (this.newSettings.twoFa != this.account.twoFa)
        this.account.twoFa = this.newSettings.twoFa;
  }

	onImageSelected(event: any): void
	{
		if (<HtmlImputEvent>event.target.files && <HtmlImputEvent>event.target.files[0])
		{
			this.files = <File>event.target.files[0]
			const reader = new FileReader()
			reader.onload = e => this.newSettings.profilePicture = reader.result!
			reader.readAsDataURL(this.files)
		}
	}

  uploadNewSettings(): void
  {
    this.updateAccount();
    this.resetSettings();
    console.log(this.account);
  }

}
