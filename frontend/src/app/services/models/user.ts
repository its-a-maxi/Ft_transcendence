export class User{
  
    constructor(id = 0,
              nick = "",
              avatar = "",
              email = "",
              authentication = false) {
        
        this.id = id;
        this.nick = nick;
        this.avatar = avatar;
        this.email = email;
        this.authentication = authentication;
      }

    id: number;
    nick: string;
    avatar: string;
    email: string;
    authentication?: boolean;
}