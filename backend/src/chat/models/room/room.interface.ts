import { UserI } from "src/users/user-service/models/user.interface";

export interface RoomI
{
    id: number;
    ownerId: number;
    name: string;
    password: string;
    option: string;
    users: UserI[];
    crated_at?: Date;
    update_at?: Date;
}