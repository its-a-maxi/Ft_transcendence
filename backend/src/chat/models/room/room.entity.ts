import { UserEntity } from "src/users/user-service/models/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { JoinedRoomEntity } from "../joined-room/joined-room.entity";
import { MessageEntity } from "../messages/messages.entity";


@Entity()
export class RoomEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    ownerId: number;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    password: string;

    @Column({nullable: true})
    option: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[]

    @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
    joinedUsers: JoinedRoomEntity[];

    @OneToMany(() => MessageEntity, message => message.room)
    messages: MessageEntity[];

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date;
}