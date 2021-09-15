import { UserEntity } from "src/users/user-service/models/entities/users.entity";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";


@Entity()
export class JoinedRoomEntity// extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    socketId: string;

    @ManyToOne(() => UserEntity, user => user.joinedRooms, {
        primary: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.joinedUsers, {
        primary: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    room: RoomEntity;
}
