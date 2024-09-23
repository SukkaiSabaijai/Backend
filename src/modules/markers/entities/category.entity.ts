import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    text: string

    @Column()
    type: string
}