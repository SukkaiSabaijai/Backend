import {  Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ToiletCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: false })
    disable: boolean;

    @Column({ default: false })
    hose: boolean;

    @Column({ default: false })
    flush: boolean;
}

@Entity()
export class RestAreaCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: false })
    table: boolean;

    @Column({ default: false })
    charger: boolean;

    @Column({ default: false })
    wifi: boolean;    
}