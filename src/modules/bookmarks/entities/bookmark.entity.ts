import { Marker } from 'src/modules/markers/entities/marker.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookmark {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.bookmarks)
	user_id: User;

	@ManyToOne(() => Marker, (marker) => marker.bookmarks)
	marker_id: Marker;

	@Column()
	short_name: string;
}
