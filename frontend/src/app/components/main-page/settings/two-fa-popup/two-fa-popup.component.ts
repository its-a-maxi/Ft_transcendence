import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-two-fa-popup',
  templateUrl: './two-fa-popup.component.html',
  styleUrls: ['./two-fa-popup.component.css']
})
export class TwoFaPopupComponent implements OnInit {

phone: string = ""
code: string = ""
userPhone: string = ""
userEmail: string = ""
qrImage: string = ""
paramId: string | null = sessionStorage.getItem('token');

@Output('closeOverlay') closeOverlay: EventEmitter<any> = new EventEmitter();

constructor(public authService: AuthService, private router: Router) { }

ngOnInit(): void
{
  this.getQrCode()
}

getQrCode()
{
    this.authService.twoFactor().then(res => this.qrImage = res.data.url)
}

verifyCode(form: NgForm)
{
  this.authService.verifyCode(form.value)
    .then((res) => {
      alert('2 Factor Authentication Success!!');
      this.closeOverlay.emit();
      })
    .catch(() => {
      alert('2 Factor Authentication Failure!!')
    })
}

}
