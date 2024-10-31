import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Marker } from '../markers/entities/marker.entity';
import { Review } from '../reviews/entities/review.entity';
import { GetReviewHistory } from './dto/responses/get-review-history.dto';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) { }

  async findAllMarkers(userId: number): Promise<Marker[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['markers'],
    });

    return user.markers;
  }

  async findAllReviews(userId: number): Promise<GetReviewHistory[]> {
    const reviews = await this.reviewRepository.find({
      where: { user: {id: userId}} ,
      relations: ['marker'],
    });

    const returnReview = reviews.map(review => <GetReviewHistory>{
      id: review.id,
      createdAt: review.createdAt,
      rating: review.rating,
      review: review.review,
      markerId: review.marker.id
    })
    return returnReview;
  }

}
