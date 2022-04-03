import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("workout")
export class Workout extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    author: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column({default: ""})
    description: string;

    @Column({default: 0})
    reps: number;

    @Column({default: 0})
    sets: number;

    @Column({default: 0})
    duration: number;

    @Column({default: 0})
    calories: number

    @CreateDateColumn()
    createdAt: number;
}