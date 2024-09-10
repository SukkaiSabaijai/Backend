import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto/get-user-dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<GetUserDto[]> {
    const users = await this.usersRepository.find();
    return plainToInstance(GetUserDto, users, { excludeExtraneousValues: true });
  }

  async findOne(id: number): Promise<GetUserDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error(`User with ID #${id} not found`);
    }
    return plainToInstance(GetUserDto, user, { excludeExtraneousValues: true });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error(`User with ID #${id} not found`);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }
}
