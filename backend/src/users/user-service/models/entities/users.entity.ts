import { ConnectedUserEntity } from "src/chat/models/connected-user/connected-user.entity";
import { JoinedRoomEntity } from "src/chat/models/joined-room/joined-room.entity";
import { MessageEntity } from "src/chat/models/messages/messages.entity";
import { RoomEntity } from "src/chat/models/room/room.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn} from "typeorm";
import { UserI } from "../user.interface";

@Entity('users')
export class UserEntity
{
    @PrimaryColumn({unique: true})
    id: number;

    @Column()
    nick: string;

    @Column()
    email: string;

    @Column()
    avatar: string;

    @Column()
    authentication: boolean;

    @Column({ nullable: true })
    secret?: string;

    @Column("simple-array", {nullable: true})
    blackList: string[];
    
    @Column({default: false})
    isBanned?: boolean;

    @ManyToMany(() => RoomEntity, room => room.users)
    rooms: RoomEntity

    @OneToMany(() => ConnectedUserEntity, connection => connection.user)
    connections: ConnectedUserEntity[];

    @OneToMany(() => JoinedRoomEntity, joinedRoom => joinedRoom.room)
    joinedRooms: JoinedRoomEntity[];

    @OneToMany(() => MessageEntity, message => message.user)
    messages: MessageEntity[];

}