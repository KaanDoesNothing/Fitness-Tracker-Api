import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("exercise")
export class Exercise extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    author: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: number;
}