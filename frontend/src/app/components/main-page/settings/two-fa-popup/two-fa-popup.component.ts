import { Component, DoCheck, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { ChatService } from 'src/app/services/chat-service/chat.service';

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
test: string = ""
dataQR: boolean = false

@Output('closeOverlay') closeOverlay: EventEmitter<any> = new EventEmitter();

constructor(public authService: AuthService, private chatService: ChatService) { }

ngOnInit(): void
{
    this.chatService.getQR().subscribe(res => {
        if (this.qrImage === 'http://localhost:3000/auth/assets/qrImage.png')
        {
            this.qrImage = ""
            this.authService.getRuteQr().then(() => setTimeout(() => { this.dataQR = true } , 0) )
        }
        setTimeout(() => {
            this.qrImage = res
            this.dataQR = true
        }, 0)
        
       
    })
    //this.getQrCode()
}

getQrCode()
{
    this.authService.twoFactor().then(res => this.qrImage = res.data.url)
}

verifyCode(form: NgForm)
{
  this.authService.verifyCode(form.value, parseInt(this.paramId!))
    .then((res) => {
      alert('2 Factor Authentication Success!!');
      this.closeOverlay.emit();
      })
    .catch(() => {
      alert('2 Factor Authentication Failure!!')
    })
}

}
