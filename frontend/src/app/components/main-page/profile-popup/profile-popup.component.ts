import { Component, Input, OnInit } from '@angular/core';
import { UserI } from 'src/app/services/models/user.interface';

@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.css']
})
export class ProfilePopupComponent implements OnInit {

  constructor() { }

  @Input() userPopup!: UserI;

  ngOnInit(): void {
    this.winsDefeats();
  }

  winsDefeats()
  {
    let defeatsPercent: number;
		let defeatsBar = document.getElementById("defeats");

    if (this.userPopup.defeats! <= 0 && this.userPopup.wins! <= 0)
      defeatsPercent = 50;
    else if (this.userPopup.defeats! <= 0 && this.userPopup.wins! > 0)
      defeatsPercent = 0;
    else if (this.userPopup.wins! <= 0 && this.userPopup.defeats! > 0)
      defeatsPercent = 100;
    else
      defeatsPercent = this.userPopup.defeats! * 100 / (this.userPopup.wins! + this.userPopup.defeats!);
		defeatsBar!.style.width = defeatsPercent + "%";
    console.log(defeatsPercent);
  }


}
