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
  @Input() list: Array<RoomI> = [];

  ngOnInit(): void {
  }

  enter(room: RoomI)
  {
    this.directMessage.emit(room);
    this.closeOverlay.emit();
  }

}
