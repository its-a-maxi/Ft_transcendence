import { UserI } from "src/users/user-service/models/user.interface";
import { RoomI } from "../room/room.interface";


export interface JoinedRoomI
{
    id?: number;
    userId: number;
    socketId: string;
    user: UserI;
    room: RoomI;
}