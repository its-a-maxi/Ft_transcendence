import { UserEntity } from "src/users/user-service/models/entities/users.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('conn')
export class ConnectedUserEntity
{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    socketId: string;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity, user => user.connections)
    @JoinColumn()
    user: UserEntity
}