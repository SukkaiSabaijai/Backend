import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';
import { Category } from './category.entity';
import { MarkerPic } from './marker_pics.entity';
import { Grid } from './grid.entity';

@Entity()
export class Marker {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.markers)
	created_by: User;

	@ManyToOne(() => Grid, (grid) => grid.markers)
	grid_id: Marker;

	@Column()
	latitude: number;

	@Column()
	longitude: number;

	@Column()
	location_name: string;

	@Column()
	type: string;

	@Column()
	detail: string;

	@Column()
	review_avg_score: number;

	@Column()
	review_count: number;

	@ManyToMany(() => Category)
	@JoinTable()
	categories: Category[];

	@OneToMany(() => MarkerPic, (marker_pic) => marker_pic.marker_id)
	marker_pics: MarkerPic[];

	@OneToMany(() => Review, (review) => review.marker_id)
	reviews: Review[];

	@OneToMany(() => Bookmark, (bookmark) => bookmark.marker_id)
	bookmarks: Bookmark[];
}
