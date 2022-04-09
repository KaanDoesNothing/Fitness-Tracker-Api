import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsEmail, MinLength} from "class-validator";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    @MinLength(1)
    password: string;

    @Column()
    @MinLength(1)
    username: string;

    @CreateDateColumn()
    createdAt: number;
}