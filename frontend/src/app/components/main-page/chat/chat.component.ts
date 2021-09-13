import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/services/models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  mainUser: User | undefined;

  // USERS/FRIENDS VARIABLES
  friends: Array<User> = [];
  private notFriends: Array<User> = [];
  private allUsers: Array<User> = [];

  // CHANNELS VARIABLES
  myChannels: Array<string> = [];
  private notJoinedChannels: Array<string> = [];
  private allChannels: Array<string> = [];

  // ADD FRIEND/CHANNEL SEARCH
  searchPlaceholder = "";
  searchInput: string = "";
  searchResult: Array<any> = [];
  private searchType: string = "";

  // CHAT VARIABLES
  message: string = "";
  currentChat: any = "";

  async ngOnInit()  // RUN AT PAGE LOAD
  {
    // Get main user
    await this.authService.getAuthUser()
      .then(response => this.mainUser = response.data);
    // Get main user friends
    if (this.mainUser && this.mainUser.friends)
      this.friends = this.mainUser.friends;
    // Sort friends, connected friends before disconnected ones
    this.sortConnected();
    // Get all users registered in the DB
    await this.authService.showAllUsers()
      .then(response => this.allUsers = response.data.filter(x => x.id != this.mainUser?.id));
    // Start in #General
      this.changeChat("#General");

    // TEST
      let lapin: User = new User;
      lapin.nick = 'Lapin';
      lapin.name = 'lhare-c';
      let mr: User = new User;
      mr.nick = 'Mr. Robbinson';
      mr.name = 'arobbinson';
      mr.isConnected = true;
      let ma: User = new User;
      ma.nick = 'Mahey';
      ma.name = 'mvelazquez';
      let la: User = new User;
      la.nick = 'Alex';
      la.name = 'aleon-ca';
      this.allUsers.push(ma);
      this.allUsers.push(mr);
      this.allUsers.push(la);
    for(let i = 0; i < 20; ++i)
      this.allUsers.push(lapin);
    
    this.allChannels.push("#General");
    for(let i = 0; i < 20; ++i)
      this.allChannels.push("#Random");
    
  }

  sendMessage()
  {
    console.log(this.currentChat + " - " + this.mainUser?.nick + ": " + this.message);
    this.message = "";
  }

  changeChat(newChat: any)
  {
    if (this.currentChat != newChat)
    {
      let closeChat = document.getElementById("closeChat");
      if (newChat == "#General")
        closeChat!.style.display = "none";
      else
        closeChat!.style.display = "block"; 
      this.currentChat = newChat;
      this.closeOverlay();
      console.log("Chat has changed to " + newChat);
    }
  }

  async addFriend(newFriend: User)  // ADD USER TO FRIENDS LIST
  {
    let overlay = document.getElementById("overlayFriends");

    this.friends.push(newFriend);
    // Sort friends, connected friends before disconnected ones
    this.sortConnected();
  // IMPORTANT! Needs to be updated in the database
    console.log("Please, update friend list");
    if (overlay?.style.opacity == '1')
      this.closeAddOverlay();
    else
      this.closeOverlay();
  }

  async addChannel(newChannel: string)  // ADD CHANNEL TO MYCHANNELS LIST
  {
    let overlay = document.getElementById("overlayChannels");

    this.myChannels.push(newChannel);
  // IMPORTANT! Needs to be updated in the database
    console.log("Please, update channel list");
    if (overlay?.style.opacity == '1')
      this.closeAddOverlay();
    else
      this.closeOverlay();
  }

  async deleteChat(oldChat: any)  // DELETES FRIENDS OR CHANNELS DEPPENDING ON CURRENT CHAT
  {
    let rst: Array<any> = []
    if (oldChat instanceof User)
    {
      for(let i = 0; this.friends[i]; i++)
        if (this.friends[i] != oldChat)
          rst.push(this.friends[i]);
      this.friends = rst;
    }
    else
    {
      for(let i = 0; this.myChannels[i]; i++)
        if (this.myChannels[i] != oldChat)
          rst.push(this.myChannels[i]);
      this.myChannels = rst;
    }
  // IMPORTANT! Needs to be updated in the database
    console.log("Please, update friend list");
    this.sortConnected();
    this.changeChat("#General");
  }

  showAtSearch()  // WILL UPDATE THE LIST OF NO-MEMBER-CHANNELS / NO-FRIENDS DEPENDING ON SEARCH INPUT
  {
    // Reset list
    this.searchResult = [];
    // Transform search input to upper case so lowcase and uppercase are the same
    let filter = this.searchInput.toUpperCase();

    // Search algorithm for user
    if (this.searchType == "user")
      for (let i = 0; this.notFriends[i]; i++)
      {
        let txtValue = this.notFriends[i].name + this.notFriends[i].nick;
        if (txtValue.toUpperCase().indexOf(filter) > -1)
          this.searchResult.push(this.notFriends[i]);
    }
    // Search algorithm for channel
    if (this.searchType == "channel")
      for (let i = 0; this.notJoinedChannels[i]; i++)
      {
        let txtValue = this.notJoinedChannels[i];
        if (txtValue.toUpperCase().indexOf(filter) > -1)
          this.searchResult.push(this.notJoinedChannels[i]);
      }
  }

  showOverlaySee(type: string)
  {
    this.showOverlay();
    if (type == "friends")
    {
      let btn = document.getElementById("overlayBtnFriend");
      let friends = document.getElementById("overlayFriends");
      btn!.style.width = "7vh";
      btn!.style.height = "7vh";
      friends!.style.opacity = "100%";
      friends!.style.height = "80%";
      friends!.style.width = "46vh";
    }
    if (type == "channels")
    {
      let btn = document.getElementById("overlayBtnChannel");
      let channels = document.getElementById("overlayChannels");
      btn!.style.width = "7vh";
      btn!.style.height = "7vh";
      channels!.style.opacity = "100%";
      channels!.style.height = "80%";
      channels!.style.width = "46vh";
    }
  }

  showOverlayAdd(type: string) : void // SHOWS BASE 'ADD' OVERLAY
  {
    this.showOverlay();

    let overlay = document.getElementById("overlayAdd");

    overlay!.style.opacity = "100%";
    overlay!.style.height = "80%";
    overlay!.style.width = "46vh";

    if (type == "friends")
    {
      let friends = document.getElementById("addFriendsList");
      friends!.style.display = "block";
      this.searchPlaceholder = "Search for users...";
      this.getNotFriends();
      this.searchResult = this.notFriends;
    }
    if (type == "channels")
    {
      let channel = document.getElementById("addChannelsList");
      channel!.style.display = "block";
      this.searchPlaceholder = "Search for channels...";
      this.getNotJoinedChannels();
      this.searchResult = this.notJoinedChannels;
    }
  }

  private showOverlay()
  {
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");

    container!.style.opacity = "50%";
    overlayBack!.style.display = "block";
  }

  closeOverlay() : void // CLOSES ANY OVERLAY
  {
    let container = document.getElementById("container");
    let overlayBack = document.getElementById("overlayBack");
    let overlay = document.getElementById("overlayAdd");
    let channel = document.getElementById("addChannelsList");
    let friends = document.getElementById("addFriendsList");
    let friend = document.getElementById("overlayFriends");
    let channels = document.getElementById("overlayChannels");
    let btnFriend = document.getElementById("overlayBtnFriend");
    let btnChannel = document.getElementById("overlayBtnChannel");


    container!.style.opacity = "100%";
    overlayBack!.style.display = "none";
    overlay!.style.opacity = "0%";
    overlay!.style.height = "0vh";
    overlay!.style.width = "0vh";
    friend!.style.opacity = "0%";
    friend!.style.height = "0vh";
    friend!.style.width = "0vh";
    channels!.style.opacity = "0%";
    channels!.style.height = "0vh";
    channels!.style.width = "0vh";
    friends!.style.display = "none";
    channel!.style.display = "none";
    btnFriend!.style.width = "0vh";
    btnFriend!.style.height = "0vh";
    btnChannel!.style.width = "0vh";
    btnChannel!.style.height = "0vh";
  }

  closeAddOverlay()
  {
    let overlay = document.getElementById("overlayAdd");
    let channel = document.getElementById("addChannelsList");
    let friends = document.getElementById("addFriendsList");
    overlay!.style.opacity = "0%";
    overlay!.style.height = "0vh";
    overlay!.style.width = "0vh";
    friends!.style.display = "none";
    channel!.style.display = "none";
  }

  private sortConnected(): void // SORTS FRIENDS LIST, CONNECTED FRIENDS WILL GO BEFORE DISCONNECTED ONES
  {
    for (let i = 1; this.friends && this.friends[i]; i++)
    {
      let j = i - 1;
      let temp = this.friends[i];
      while (j >= 0 && temp.isConnected == true)
      {
        this.friends[j + 1] = this.friends[j];
        j--;
      }
      this.friends[j + 1] = temp;
    }
  }

  private getNotFriends() // COMPARES FRIENDS LIST WITH ALLUSERS LIST TO GET THE USERS NOT BEFRIENDED
  {
    this.notFriends = [];
    for (let i = 0; this.allUsers[i]; i++)
    {
      let j : number;
      for (j = 0; this.friends[j]; j++)
        if (this.friends[j] == this.allUsers[i])
          break;
      if (!this.friends[j])
        this.notFriends.push(this.allUsers[i]);
    }
  }

  private getNotJoinedChannels() // COMPARES CHANNELS LIST WITH ALLCHANNELS LIST TO GET THE CHANNELS
  {
    this.notJoinedChannels = [];
    for (let i = 0; this.allChannels[i]; i++)
    {
      let j : number;
      for (j = 0; this.myChannels[j]; j++)
        if (this.myChannels[j] == this.allChannels[i])
          break;
      if (!this.myChannels[j])
        this.notJoinedChannels.push(this.allChannels[i]);
    }
  }

}
