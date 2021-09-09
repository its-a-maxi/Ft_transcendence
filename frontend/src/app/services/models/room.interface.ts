import { UserI } from "./user.interface";

export interface RoomI
{
    id: number;
    ownerId: number;
    name: string;
    password: string;
    option: string;
    users: UserI[];
    crated_at?: Date;
    updated_at?: Date
}