import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoomI } from 'src/app/services/models/room.interface';

@Component({
  selector: 'app-channel-list-hidden',
  templateUrl: './channel-list-hidden.component.html',
  styleUrls: ['./channel-list-hidden.component.css']
})
export class ChannelListHiddenComponent implements OnInit {

  constructor() { }

  @Output('directMessage') directMessage: EventEmitter<any> = new EventEmitter();
  @Output('closeOverlay') closeOverlay: EventEmitter<any> = new EventEmitter();
  @Output('showOverlay') showOverlay: EventEmitter<any> = new EventEmitter();
  @Input() list: Array<RoomI> = [];

  private paramId: string | null = sessionStorage.getItem('token');
  userId: number = 0;

  ngOnInit(): void {
    this.userId = parseInt(this.paramId!, 10);
  }

  enter(room: RoomI)
  {
    this.closeOverlay.emit();
    this.directMessage.emit(room);
  }

  create()
  {
    this.closeOverlay.emit();
    this.showOverlay.emit('newChannel');
  }

}
