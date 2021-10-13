import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomI } from 'src/app/services/models/room.interface';
import { User } from 'src/app/services/models/user';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
  selector: 'app-user-list-hidden',
  templateUrl: './user-list-hidden.component.html',
  styleUrls: ['./user-list-hidden.component.css']
})
export class UserListHiddenComponent implements OnInit {

  constructor() { }

  @Output('directMessage') directMessage: EventEmitter<any> = new EventEmitter();
  @Output('blockUser') blockUser: EventEmitter<any> = new EventEmitter();
  @Output('challengeUser') challengeUser: EventEmitter<any> = new EventEmitter();
  @Output('closeOverlay') closeOverlay: EventEmitter<any> = new EventEmitter();
  @Output('showOverlay') showProfile: EventEmitter<any> = new EventEmitter();
  @Input() list: Array<UserI> = [];

  ngOnInit(): void {
  }

  enter(user: UserI)
  {
    this.directMessage.emit(user);
    this.closeOverlay.emit();
  }

  block(user: UserI)
  {
    this.blockUser.emit(user);
    this.closeOverlay.emit();
  }

  challenge(user: UserI)
  {
    this.challengeUser.emit(user);
    this.closeOverlay.emit();
  }

  profile(user: UserI)
  {
    this.closeOverlay.emit();
    this.showProfile.emit(user);
  }

}
