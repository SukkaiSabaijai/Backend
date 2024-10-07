import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Marker } from './marker.entity';

@Entity()
export class MarkerPic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Marker, (marker) => marker.marker_pics)
  marker_id: Marker;
}
