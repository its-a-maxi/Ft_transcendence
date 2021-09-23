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
}