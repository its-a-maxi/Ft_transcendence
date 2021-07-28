import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nick: string;

    @Column()
    avatar: string;

}