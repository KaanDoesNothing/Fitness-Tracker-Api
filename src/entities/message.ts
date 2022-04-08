import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("message")
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    author: string;

    @Column("longtext")
    content: string;

    @CreateDateColumn()
    createdAt: number;
}