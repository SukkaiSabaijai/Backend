import exp from 'constants';
import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Marker } from './marker.entity';

@Entity()
export class Grid {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Grid, (grid) => grid.child_grid)
	parent_grid: Grid;

	@OneToMany(() => Grid, (grid) => grid.parent_grid)
	child_grid: Grid[];

	@Column()
	level: number;

	@Column()
	max_latitude: number;

	@Column()
	min_latitude: number;

	@Column()
	max_longitude: number;

	@Column()
	mix_longitude: number;

	@Column()
	marker_count: number;

	@OneToMany(() => Marker, (marker) => marker.grid_id)
	markers: Marker[];
}
