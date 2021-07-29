import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User
{
    @PrimaryColumn({unique: true})
    id: number;

    @Column()
    nick: string;

    @Column()
    avatar: string;

}