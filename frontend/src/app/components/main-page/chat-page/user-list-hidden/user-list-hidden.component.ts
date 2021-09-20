import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
  selector: 'app-user-list-hidden',
  templateUrl: './user-list-hidden.component.html',
  styleUrls: ['./user-list-hidden.component.css']
})
export class UserListHiddenComponent implements OnInit {

  constructor() { }

  @Output('directMessage') directMessage: EventEmitter<any> = new EventEmitter();
  @Output('closeOverlay') closeOverlay: EventEmitter<any> = new EventEmitter();
  @Input() list: Array<UserI> = [];

  ngOnInit(): void {
  }

  enter(user: UserI)
  {
    this.directMessage.emit(user);
    this.closeOverlay.emit();
  }

}
