import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomI } from 'src/app/services/models/room.interface';

@Component({
  selector: 'app-get-password',
  templateUrl: './get-password.component.html',
  styleUrls: ['./get-password.component.css']
})
export class GetPasswordComponent implements OnInit {

  constructor() { }
  
  password: string = "";
  @Output('ifPassword') ifPassword: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  changeChannel()
  {
    if (this.password != "")
    {
      alert("Incorrect password");
      this.password == "";
      return;
    }
    this.ifPassword.emit(true);
  }

}
