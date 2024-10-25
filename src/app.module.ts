import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MarkersModule } from './modules/markers/markers.module';
import { User } from './modules/users/entities/user.entity';
import { Marker } from './modules/markers/entities/marker.entity';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { Review } from './modules/reviews/entities/review.entity';
import { Bookmark } from './modules/bookmarks/entities/bookmark.entity';
import { Grid } from './modules/markers/entities/grid.entity';
import { MarkerPic } from './modules/markers/entities/marker_pics.entity';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MinioModule } from './modules/minio/minio.module';
import { RestAreaCategory, ToiletCategory } from './modules/markers/entities/category.entity';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.POSTGRES_HOST,
			port: parseInt(<string>process.env.POSTGRES_PORT),
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DATABASE,
			entities: [User, Marker, Review, Bookmark, Grid, MarkerPic, RestAreaCategory, ToiletCategory],
			synchronize: true,
		}),
		AuthModule,
		UsersModule,
		MarkersModule,
		ReviewsModule,
		BookmarksModule,
		MinioModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule { }
