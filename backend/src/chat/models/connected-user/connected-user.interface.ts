import { UserI } from "../../../users/user-service/models/user.interface";


export interface ConnectedUserI
{
    id?: number;
    socketId: string;
    user: UserI
}