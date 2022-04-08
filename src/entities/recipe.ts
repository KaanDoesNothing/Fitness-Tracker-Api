import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("recipe")
export class Recipe extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    author: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column("longtext")
    content: string;

    @CreateDateColumn()
    createdAt: number;
}