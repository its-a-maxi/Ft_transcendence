import { UserEntity } from "src/users/user-service/models/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";


@Entity()
export class JoinedRoomEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    socketId: string;

    @ManyToOne(() => UserEntity, user => user.joinedRooms)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.joinedUsers)
    @JoinColumn()
    room: RoomEntity;
}