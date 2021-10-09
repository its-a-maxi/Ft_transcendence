import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-two-fa-check',
  templateUrl: './two-fa-check.component.html',
  styleUrls: ['./two-fa-check.component.css']
})
export class TwoFaCheckComponent implements OnInit, OnDestroy {

  code: string = ""
  userPhone: string = ""
  userEmail: string = ""
  paramId: string = ""
  
  constructor(public authService: AuthService, private router: Router, private activateRoute: ActivatedRoute) { }
  
  ngOnInit(): void
  {
    if (!this.paramId)
    {
        this.paramId = this.activateRoute.snapshot.paramMap.get('id')?.substr(0, 5)!
        sessionStorage.setItem('token', this.paramId)
    }
  }

  ngOnDestroy()
  {
      setTimeout(() =>  window.location.reload(), 0)
  }
  
  verifyCode(form: NgForm)
  {
    this.authService.verifyCode(form.value, parseInt(this.paramId))
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
