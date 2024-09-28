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
	user_id: User;

	@ManyToOne(() => Marker, (marker) => marker.reviews)
	marker_id: Marker;

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@Column()
	score: number;

	@Column()
	text: string;
}
