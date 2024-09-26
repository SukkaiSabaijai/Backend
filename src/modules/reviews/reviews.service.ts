import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Marker } from '../markers/entities/marker.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

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
  async createReview(
    userId: number,
    markerId: number,
    rating: number,
    review: string,
  ): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const marker = await this.markerRepository.findOne({
      where: { id: markerId },
    });
    if (!marker) {
      throw new NotFoundException('Marker not found');
    }

    const newReview = this.reviewRepository.create({
      user_id: user,
      marker_id: marker,
      score: rating,
      text: review,
    });
    return await this.reviewRepository.save(newReview);
  }

  async findReviewsByMarker(markerId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { id: markerId }, // Use the correct field name
      relations: ['user'], // Fetch related user details if needed
    });
  }

  async findReviewsByUser(userId: number): Promise<Review[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return await this.reviewRepository.find({
      where: { id: userId }, // Use the user object in the condition
      relations: ['marker'], // Fetch the related marker
    });
  }
}
