import { UserEntity } from "src/users/user-service/models/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomEntity } from "../room/room.entity";

@Entity()
export class MessageEntity
{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @ManyToOne(() => UserEntity, user => user.messages)
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => RoomEntity, room => room.messages)
    @JoinTable()
    room: RoomEntity;

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date;
}