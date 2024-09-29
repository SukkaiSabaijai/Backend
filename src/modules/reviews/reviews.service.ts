import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Marker } from '../markers/entities/marker.entity';
import { Body, Injectable, NotFoundException, ForbiddenException, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { Request } from '@nestjs/common';
import { CreateReviewsDto } from './dto/create-review.dto';
import { CreateUserDto } from '../users/dto/requests/create-user.dto';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Marker)
    private readonly markerRepository: Repository<Marker>,
  ) {}

  // Create review
  @UseGuards(AccessTokenGuard)
  async createReview(
    user_id: number,
    createReviewDto: CreateReviewsDto,
  ): Promise<Review> {
    const { markerId, rating, review } = createReviewDto;
    const marker = await this.markerRepository.findOne({
      where: { id: markerId },
    });
    if (!marker) {
      throw new NotFoundException('Marker not found');
    }
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    console.log(user.username);
    const newReview = this.reviewRepository.create({
      user_id: user,
      marker_id: marker,
      score: rating,
      text: review,
    });
    return await this.reviewRepository.save(newReview);
  }


  async deleteReview(reviewId: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user_id'],
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    if (review.user_id.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }
    await this.reviewRepository.remove(review);
    console.log('delete successful');
  }


}
