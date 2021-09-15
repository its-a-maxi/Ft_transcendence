import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { User } from 'src/app/services/models/user';
import { TwoFaPopupComponent } from './two-fa-popup/two-fa-popup.component';

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
  oldAuthentication: boolean = false;

  nick: string = "";
  email: string = "";
  authentication: boolean = false;
	profilePicture: string | ArrayBuffer | undefined = "";

  private check: boolean = false;

  paramId: string | null = sessionStorage.getItem('token');

  @ViewChild(TwoFaPopupComponent) child?: TwoFaPopupComponent;

  constructor(public authService: AuthService, private router: Router, private activateRoute: ActivatedRoute) { }

  async ngOnInit() {
    if (!this.paramId)
    {
      this.paramId = this.activateRoute.snapshot.paramMap.get('id')?.substr(0, 5)!
      sessionStorage.setItem('token', this.paramId)
      window.location.reload();
    }
    await this.findUser(this.paramId);

    this.oldNick = this.user!.nick;
    this.oldEmail = this.user!.email;
    if (this.user?.authentication)
    {
      this.oldAuthentication = this.user.authentication;
      this.authentication = this.user.authentication;
    }
    this.profilePicture = this.user?.avatar;
  }


	async findUser(id: string)
	{	
		await this.authService.getUserById(id)
			.then(res => {
				if (res.data === "ERROR!!")
				{
					this.authService.logOutUser(false)
					this.router.navigate(['/landingPage/start'])
				}
				else
					this.user = res.data;
			})
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
      this.user.authentication = this.authentication;
      await this.authService.updateUser(this.user);
      //if (this.user.authentication != this.oldAuthentication && this.user.authentication)
      //  this.router.navigate(['/twofa']);
      //else
        window.location.reload();
      return;
    }
  }

  showOverlay() : void
  {
    if (this.authentication == true)
      return;
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let popup = document.getElementById("popup");
    container!.style.opacity = "50%";
    overlayBack!.style.display = "block";
    popup!.style.display = "block";
  }

  closeOverlay(check: boolean) : void
  {
    if (check == false)
      this.authentication = false;
      
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let popup = document.getElementById("popup");
    container!.style.opacity = "100%";
    overlayBack!.style.display = "none";
    popup!.style.display = "none";
  }
}
