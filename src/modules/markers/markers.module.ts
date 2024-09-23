import { Module } from '@nestjs/common';
import { MarkersController } from './markers.controller';
import { MarkersService } from './markers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Marker } from './entities/marker.entity';
import { Category } from './entities/category.entity';
import { MarkerPic } from './entities/marker_pics.entity';
import { Grid } from './entities/grid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Marker,Category,MarkerPic,Grid])],
  controllers: [MarkersController],
  providers: [MarkersService]
})
export class MarkersModule {}
