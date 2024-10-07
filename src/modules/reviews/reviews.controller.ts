import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { CreateReviewsDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

  // Post /review/create
  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createReview(
    @Req() req,
    @Body() createReviewsDto: CreateReviewsDto,
  ): Promise<Review> {
    const userId = await req.user['sub'];
    return this.reviewsService.createReview(userId, createReviewsDto);
  }

  @Get('marker/:markerId/reviews')
  async getReviewsForMarker(
    @Param('markerId') markerId: number,
  ): Promise<Review[]> {
    return this.reviewsService.getReviewsByMarkerId(markerId);
  }

  // Delete /reviews/delete/:id
  @UseGuards(AccessTokenGuard)
  @Delete('delete/:id')
  async deleteReview(@Param('id') reviewId: number, @Req() req): Promise<void> {
    const userId = req.user['sub'];
    return await this.reviewsService.deleteReview(reviewId, userId);
  }
}
