import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

	@Post()
	async createReview(
		@Body('userId') userId: number,
		@Body('markerId') markerId: number,
		@Body('rating') rating: number,
		@Body('review') review: string,
	): Promise<Review> {
		return this.reviewsService.createReview(userId, markerId, rating, review);
	}

	// GET /reviews/marker/:markerId
	@Get('/marker/:markerId')
	async getReviewsByMarker(
		@Param('markerId') markerId: number,
	): Promise<Review[]> {
		return this.reviewsService.findReviewsByMarker(markerId);
	}

	// GET /reviews/user/:userId
	@Get('/user/:userId')
	async getReviewsByUser(@Param('userId') userId: number): Promise<Review[]> {
		return this.reviewsService.findReviewsByUser(userId);
	}
}
