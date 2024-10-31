import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Marker } from '../markers/entities/marker.entity';
import {
  Body,
  Injectable,
  NotFoundException,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { Request } from '@nestjs/common';
import { CreateReviewsDto } from './dto/create-review.dto';
import { CreateUserDto } from '../users/dto/requests/create-user.dto';
import { GetReviewDTO, ReturnReview } from './dto/getReviewResponse.dto';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Marker)
    private readonly markerRepository: Repository<Marker>,
  ) { }

  async createReview(
    user_id: number,
    createReviewDto: CreateReviewsDto,
  ): Promise<{ status: boolean }> {
    const { markerId, rating, review } = createReviewDto;
    const marker = await this.markerRepository.findOne({
      where: { id: markerId },
    });
    if (!marker) {
      return { status: false };
    }
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    
    const newReview = this.reviewRepository.create({
      user: user,
      marker: marker,
      rating: rating,
      review: review ?? '',
    });
    
    marker.review_count += 1;
    marker.review_total_score += newReview.rating;
  
    await this.reviewRepository.save(newReview);
  
    return { status: true };
  }


  async getReviewsByMarkerId(markerId: number): Promise<GetReviewDTO> {
    const marker = await this.markerRepository.findOne({
      where: { id: markerId },
      relations: ['reviews', 'reviews.user'],
    });
  
    if (!marker) {
      throw new NotFoundException('Marker not found');
    }
  
    const reviews = await marker.reviews; 
    const reviewDetails = reviews.map(review => <ReturnReview>{
      username: review.user.username,
      userPic: review.user.user_pic,
      rating: review.rating,
      review: review.review
    });
  
    const reviewCount = marker.review_count;
    const score = reviewCount > 0? marker.review_total_score / reviewCount:0;
    const reviewResponse = new GetReviewDTO;
    reviewResponse.markerId = marker.id;
    reviewResponse.avgRating = score;
    reviewResponse.reviewCount = reviewCount;
    reviewResponse.reviews = reviewDetails
  
    return reviewResponse;
  }

  async deleteReview(reviewId: number, userId: number, markerId: number): Promise<void> {
    const marker = await this.markerRepository.findOne({
      where: { id: markerId },
    });
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }
    marker.review_count -= 1;
    marker.review_total_score -= review.rating
    await this.reviewRepository.remove(review);
  }
}
