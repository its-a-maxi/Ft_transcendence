import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-two-fa-check',
  templateUrl: './two-fa-check.component.html',
  styleUrls: ['./two-fa-check.component.css']
})
export class TwoFaCheckComponent implements OnInit {

  code: string = ""
  userPhone: string = ""
  userEmail: string = ""
  
  constructor(public authService: AuthService, private router: Router,) { }
  
  ngOnInit(): void
  {
  }
  
  verifyCode(form: NgForm)
  {
    this.authService.verifyCode(form.value)
      .then((res) => {
        alert('2 Factor Authentication Success!!');
        console.log(res.data.nick);
        this.router.navigate(['/mainPage/settings/' + res.data.nick]);
        })
      .catch(() => {
        alert('2 Factor Authentication Failure!!')
      })
  }
  
  }
