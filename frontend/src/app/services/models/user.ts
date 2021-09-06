export class User{
  
    constructor(id = 0,
              nick = "",
              name = "",
              avatar = "",
              email = "",
              phone = "",
              authentication = false) {
        
        this.id = id;
        this.nick = nick;
        this.name = name;
        this.avatar = avatar;
        this.email = email;
        this.phone = phone;
        this.authentication = authentication;
      }

    id: number;
    nick: string;
    avatar: string | ArrayBuffer;
    name: string;
    email: string;
    phone: string;
    authentication?: boolean;
}