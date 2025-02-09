import { Module } from '@nestjs/common';
import { MarkersController } from './markers.controller';
import { MarkersService } from './markers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Marker } from './entities/marker.entity';
import { MarkerPic } from './entities/marker_pics.entity';
import { Grid } from './entities/grid.entity';
import { RestAreaCategory, ToiletCategory } from './entities/category.entity';
import { MinioModule } from '../minio/minio.module';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Marker,MarkerPic,Grid,RestAreaCategory,ToiletCategory,Bookmark]),MinioModule],
  controllers: [MarkersController],
  providers: [MarkersService],
})
export class MarkersModule {}
