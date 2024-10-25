import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Marker } from '../markers/entities/marker.entity';
import { Review } from '../reviews/entities/review.entity';

@Injectable()
export class HistoriesService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findAllMarkers(userId: number): Promise<Marker[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['markers'],
    });

    return user.markers;
  }

  async findAllReviews(userId: number): Promise<Review[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['reviews'],
    });

    return user.reviews;
  }

}
