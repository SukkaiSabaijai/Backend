import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookmarksService {
	constructor(
		@InjectRepository(Bookmark)
		private bookmarkRepository: Repository<Bookmark>,
	) {}
}
