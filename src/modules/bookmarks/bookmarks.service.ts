import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Marker } from '../markers/entities/marker.entity';
import { CreateBookmarkDto } from './dto/create-bookmark-dto';
import { ForbiddenException } from '@nestjs/common';
import { UpdateBookmarkDto } from './dto/update-bookmark-dto';
import { CreateBookmarkResponse } from './dto/responses/response-create-bookmark-dto';
@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,
    @InjectRepository(Marker)
    private markerRepository: Repository<Marker>,
  ) {}

  async createBookmark(
    user_id: number,
    createBookmarkDto: CreateBookmarkDto,
  ): Promise<CreateBookmarkResponse> {
    const { markerId, nickname } = createBookmarkDto;
    const marker = await this.markerRepository.findOne({
      where: { id: markerId },
    });
    
    if (!marker) {
      throw new NotFoundException('Marker not found');
    }

    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existMarker = await this.bookmarkRepository.findOne({where: {marker: marker, user: user}});

    if (existMarker) {
      await this.bookmarkRepository.remove(existMarker);
      console.log('Bookmark already removed');
      return
    }

    const newBookmark = this.bookmarkRepository.create({
      user: user,
      marker: marker,
      short_name: nickname,
    });
    const returnBookmark = await this.bookmarkRepository.save(newBookmark);
    const responseBookmark = new CreateBookmarkResponse(returnBookmark.id,returnBookmark.marker, returnBookmark.short_name);
    return responseBookmark;    
  }

  // async deleteBookmark(bookmarkId: number, userId: number): Promise<void> {
  //   const bookmark = await this.bookmarkRepository.findOne({
  //     where: { id: bookmarkId },
  //     relations: ['user'],
  //   });
  //   if (!bookmark) {
  //     throw new NotFoundException(`Bookmark with ID ${bookmarkId} not found`);
  //   }
  //   if (bookmark.user.id !== userId) {
  //     throw new ForbiddenException('You are not allowed to delete this bookmark');
  //   }
  
  //   await this.bookmarkRepository.remove(bookmark);
  // }

  async getBookmark(userId: number): Promise<Bookmark[]> {
    return await this.bookmarkRepository.find({
      where: { user: { id: userId } },
      relations: ['marker'],
    });
  }
  

  async updateBookmark(userId: number, bookmarkId: number, updateBookmarkDto: UpdateBookmarkDto): Promise<Bookmark> {
    const bookmark = await this.bookmarkRepository.findOne({
      where: {
        id: bookmarkId,
        user: { id: userId },
      },
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${bookmarkId} not found.`);
    }

    if (updateBookmarkDto.nickname !== undefined) {
      bookmark.short_name = updateBookmarkDto.nickname;
    }

    return await this.bookmarkRepository.save(bookmark);
  }
}