import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Marker } from './marker.entity';

@Entity()
export class MarkerPic {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Marker, (marker) => marker.marker_pics,{ onDelete: 'CASCADE' })
	marker: Marker;

	@Column()
	path: string;
}
