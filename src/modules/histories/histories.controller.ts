import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { AccessTokenGuard } from '../../common/accessToken.guard';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) { }

  @UseGuards(AccessTokenGuard)
  @Get("markers")
  markers(@Req() req) {
    const userId = req.user['sub']
    return this.historiesService.findAllMarkers(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get("reviews")
  reviews(@Req() req) {
    const userId = req.user['sub']
    return this.historiesService.findAllReviews(userId);
  }

}
