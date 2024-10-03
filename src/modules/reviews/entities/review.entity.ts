import { Marker } from 'src/modules/markers/entities/marker.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User; // Update field name to 'user'

  @ManyToOne(() => Marker, (marker) => marker.reviews)
  marker: Marker; // Update field name to 'marker'

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  rating: number;

  @Column()
  review: string;
}
