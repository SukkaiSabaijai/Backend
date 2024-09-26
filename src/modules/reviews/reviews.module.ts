import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Marker } from '../markers/entities/marker.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Review, Marker])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
