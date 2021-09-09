export class User{
  
    constructor(){}

    id: number = 0;
    nick: string = "";
    avatar: string | undefined = "";
    name: string = "";
    email: string = "";
    phone: string = "";
    authentication?: boolean = false;
    wins: number = 0;
    defeats: number = 0;
    coalition: string = "";
    isConnected: boolean = false;
}