import { IsNotEmpty, Length } from 'class-validator';
import { Marker } from 'src/modules/markers/entities/marker.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookmarks, { onDelete: 'CASCADE' }) // Deletes bookmark if user is deleted
  user: User;

  @ManyToOne(() => Marker, (marker) => marker.bookmarks, { onDelete: 'CASCADE' })
  marker: Marker;

  @Column()
  @IsNotEmpty()
  @Length(1, 100)
  short_name: string;
}
