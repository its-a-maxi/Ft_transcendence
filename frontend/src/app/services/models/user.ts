export class User{
  
    constructor(id = 0, nick = "", avatar = "") {
        
        this.id = id;
        this.nick = nick;
        this.avatar = avatar;

      }

    id: number;
    nick: string
    avatar: string;

}