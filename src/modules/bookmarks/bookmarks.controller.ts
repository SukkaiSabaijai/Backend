import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { CreateBookmarkDto } from './dto/create-bookmark-dto';
import { Bookmark } from './entities/bookmark.entity';
import { UpdateBookmarkDto } from './dto/update-bookmark-dto';
import { CreateBookmarkResponse } from './dto/responses/response-create-bookmark-dto';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async createBookmark(
    @Req() req,
    @Body() createBookmarksDto: CreateBookmarkDto,
  ): Promise<CreateBookmarkResponse> {
    const userId = await req.user['sub'];
    return this.bookmarksService.createBookmark(userId, createBookmarksDto);
  }

  // @UseGuards(AccessTokenGuard)
  // @Delete('/:id')
  // async deleteBookmark(
  //   @Req() req,
  //   @Param('id') bookmarkId: number,
  // ): Promise<void> {
  //   const userId = req.user['sub'];
  //   return await this.bookmarksService.deleteBookmark(bookmarkId, userId);
  // }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getBookmark(@Req() req): Promise<Bookmark[]> {
    const userId = req.user['sub'];
    return await this.bookmarksService.getBookmark(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  async putBookmark(
    @Req() req,
    @Param('id') bookmarkId: number,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
  ): Promise<Bookmark> {
    const userId = req.user['sub'];
    return await this.bookmarksService.updateBookmark(
      userId,
      bookmarkId,
      updateBookmarkDto,
    );
  }
}
