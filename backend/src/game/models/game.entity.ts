import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class GameEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    playerOne: number;

    @Column()
    playerTwo: number;

    @Column()
    option: string;

    @Column("simple-array", {nullable: true})
    socketList: string[];

    @Column("simple-array", {nullable: true})
    powerList?: string[];
}