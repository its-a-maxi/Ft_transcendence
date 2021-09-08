import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from "@angular/forms";
import { NavigationComponent } from '../../navigation/navigation.component';
import { ProfileComponent } from '../../profile/profile.component';
import { User } from 'src/app/services/models/user';

interface HtmlInputEvent extends Event
{
	target: HTMLInputElement & EventTarget
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit
{

  user: User = new User;
  profilePicture: string | ArrayBuffer = "../../../../assets/images/default.png";
	file: File | undefined;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void
  {
    this.authService.getAuthUser()
      .catch(() => this.router.navigate(['landingPage']))
  }


	onImageSelected(event: any): void
	{
		if (<HtmlInputEvent>event.target.files &&
			<HtmlInputEvent>event.target.files[0])
		{
			this.file = <File>event.target.files[0]
			const reader = new FileReader()
			reader.onload = e => this.profilePicture = reader.result!
			reader.readAsDataURL(this.file)
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
    var check = /^\d{9}$/;
    if(phone.match(check))
      return true;
    else
      return false;
  }

  async userRegister(form: NgForm)
  {
    if (!form.value['nick'] || !form.value['email'] || !form.value['phone'])
      alert("Please, complete all fields")
    else if (!this.file)
      alert("Please, choose a profile picture")
    else if (form.value['nick'].length < 4)
      alert("Please, check that your nickname has at least 4 characters")
    else if (!this.validateEmail(form.value['email']))
      alert("Please, input a valid e-mail")
    else if (!this.validatePhone(form.value['phone']))
      alert("Please, input a valid phone number")
    else
    {
      this.authService.createAvatar(this.file);
      this.user.avatar = this.file?.name!;
      this.user.nick = form.value['nick'];
      this.user.email = form.value['email'];
      this.user.phone = form.value['phone'];
      this.user.name = "default";
      await this.authService.postAuthUser(this.user);
      await this.authService.updateUser(this.user);
      form.reset();
      this.router.navigate(['/mainPage/play']).finally(() => {window.location.reload()})
      return;
      NavigationComponent.updateUserStatus.next(true)
      this.authService.postAuthUser(form.value).then(() => ProfileComponent.oldAvatar.next("ryu.jpg"))
      localStorage.setItem('nick', form.value['nick'])
      localStorage.setItem('avatar', "../../../../assets/images/default.png")
      form.reset()
      this.router.navigate(['/mainPage/play']).finally(() => {window.location.reload()})
    }
    return;
  }

}
