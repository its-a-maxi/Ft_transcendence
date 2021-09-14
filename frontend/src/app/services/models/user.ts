export class User{
      constructor(){}
  
      id: number = 0;
      nick: string = "";
      avatar: string | undefined = "";
      email: string = "";
      authentication?: boolean = false;
      secret: string = "";
      wins: number = 0;
      defeats: number = 0;
      coalition: string = "";
      isConnected: boolean = false;
      friends: Array<User> = [];
}