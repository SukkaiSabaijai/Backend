import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseGuards,
  Req,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { CreateReviewsDto } from './dto/create-review.dto';
import { GetReviewDTO } from './dto/getReviewResponse.dto';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService) {}

  // Post /review/create
  @UseGuards(AccessTokenGuard)
  @Post('create')
  async createReview(
    @Param('userId') userId: number,
    @Body() createReviewDto: CreateReviewsDto,
  ) {
    const result = await this.reviewsService.createReview(userId, createReviewDto);
    return result;
  }

  @Get('marker/:markerId/reviews')
  async getReviewsForMarker(
    @Param('markerId') markerId: string,
  ): Promise<GetReviewDTO> {
    const id = parseInt(markerId, 10);
    if (isNaN(id)) {
      throw new NotFoundException('Invalid marker ID');
    }
    return await this.reviewsService.getReviewsByMarkerId(id);
  }

  // Delete /reviews/delete/:id
  @UseGuards(AccessTokenGuard)
  @Delete('delete/:markerId/:id')
  async deleteReview(@Param('id') reviewId: number, @Param('markerId') markerId: number, @Req() req): Promise<void> {
    const userId = req.user['sub'];
    return await this.reviewsService.deleteReview(reviewId, userId, markerId);
  }
}
