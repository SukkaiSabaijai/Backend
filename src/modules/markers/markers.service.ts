import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Marker } from './entities/marker.entity';
import { Category } from './entities/category.entity';
import { MarkerPic } from './entities/marker_pics.entity';
import { Grid } from './entities/grid.entity';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Marker) private markerRepository: Repository<Marker>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(MarkerPic)
    private markerpicRepository: Repository<MarkerPic>,
    @InjectRepository(Grid) private gridRepository: Repository<Grid>,
  ) {}

  async createMarker(): Promise<Marker> {
    const newMarker = this.markerRepository.create({
      latitude: 0,
      longitude: 1,
      location_name: 'ECC Building',
      type: 'Toilet',
      detail: 'Toilet near the entrance',
      review_avg_score: 1,
      review_count: 10,
    });

    // Save the new marker to the database
    return await this.markerRepository.save(newMarker);
  }
}
