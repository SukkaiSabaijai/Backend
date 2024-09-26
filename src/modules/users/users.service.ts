import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { userID } from './dto/responses/user-id.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create({
      ...createUserDto,
    });
    const userDetail = await this.userRepository.save(newUser);
    const newUserID = new userID();
    newUserID.id = userDetail.id;
    return newUserID;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
