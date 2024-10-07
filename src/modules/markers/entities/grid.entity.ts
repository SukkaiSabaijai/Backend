import exp from "constants";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Marker } from "./marker.entity";

@Entity()
export class Grid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Grid, (grid) => grid.child_grid)
  parent_grid: Grid;

    @OneToMany(() => Grid, (grid) => grid.parent_grid)
    child_grid: Promise<Grid[]>

    @ManyToMany(() => Grid)
    @JoinTable()
    neighbors_grid: Grid[]

    @Column({default: 0})
    level: number

    @Column({type: "float"})
    max_latitude: number

    @Column({type: "float"})
    min_latitude: number

    @Column({type: "float"})
    max_longitude: number

    @Column({type: "float"})
    min_longitude: number

    @Column({default: 0})
    marker_count: number

    @OneToMany(() => Marker, (marker) => marker.grid_id)
    markers: Promise<Marker[]>
}
