import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User
{
    @PrimaryColumn({unique: true})
    id: number;

    @Column()
    nick: string;

    @Column({ unique: true})
    email: string;

    @Column({ unique: true})
    phone: string;

    @Column()
    avatar: string;

    @Column()
    authentication: boolean;

    @Column({ nullable: true })
    secret?: string;

}