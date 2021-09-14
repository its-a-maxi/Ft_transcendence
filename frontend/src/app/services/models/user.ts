export class User{
      constructor(){}
  
      id: number = 0;
      nick: string = "";
      avatar: string | undefined = "";
      name: string = "";
      email: string = "";
      authentication?: boolean = false;
}