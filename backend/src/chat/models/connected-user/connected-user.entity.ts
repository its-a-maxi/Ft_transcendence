import { UserEntity } from "src/users/user-service/models/entities/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ConnectedUserEntity
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    socketId: string;

    @ManyToOne(() => UserEntity, user => user.connections)
    @JoinColumn()
    user: UserEntity
}