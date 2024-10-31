import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { Review } from "src/modules/reviews/entities/review.entity";
import { Bookmark } from "src/modules/bookmarks/entities/bookmark.entity";
import { MarkerPic } from "./marker_pics.entity";
import { Grid } from "./grid.entity";
import { RestAreaCategory, ToiletCategory } from "./category.entity";

@Entity()
export class Marker {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.markers , { eager: true })
	created_by: User;

    @ManyToOne(() => Grid, (grid) => grid.markers)
    grid_id: Grid

    @Column({type: "float"})
    latitude: number

    @Column({type: "float"})
    longitude: number

	@Column()
	location_name: string;

	@Column()
	type: string;

	@Column()
	detail: string;

    @Column({default: 0})
    review_total_score: number

    @Column({default: 0})
    review_count: number

    @Column({default: 0})
    price: number

    @OneToOne(() => ToiletCategory, {cascade: true, nullable: true, eager: true })
    @JoinColumn()
    toiletCategory: ToiletCategory

    @OneToOne(() => ToiletCategory, {cascade: true, nullable: true, eager: true })
    @JoinColumn()
    restAreaCategory: RestAreaCategory

	@OneToMany(() => MarkerPic, (marker_pic) => marker_pic.marker, {cascade: true, eager: true})
	marker_pics: MarkerPic[];

	@OneToMany(() => Review, (review) => review.marker, {cascade: true})
	reviews: Promise<Review[]>;

	@OneToMany(() => Bookmark, (bookmark) => bookmark.marker, {cascade: true})
	bookmarks: Bookmark[];
}
