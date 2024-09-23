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
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(MarkerPic) private markerpicRepository: Repository<MarkerPic>,
        @InjectRepository(Grid) private gridRepository: Repository<Grid>
    ) {}
}
