import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Marker } from 'src/modules/markers/entities/marker.entity';
import { Review } from 'src/modules/reviews/entities/review.entity';
import { Bookmark } from 'src/modules/bookmarks/entities/bookmark.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  user_pic: string;

  @OneToMany(() => Marker, (marker) => marker.created_by)
  markers: Marker[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @Column({ nullable: true })
  refreshToken?: string;
}
