import { ChangePasswordDto } from './dto/requests/change-password.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/requests/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from './dto/response/get-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async findExistingUser(username: string, email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: [{ username }, { email }] });
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async updateRefreshToken(
    user_id: number,
    refreshToken: string,
  ): Promise<void> {
    await this.usersRepository.update(user_id, { refreshToken });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);
    return plainToInstance(GetUserDto, user, { excludeExtraneousValues: true });
  }

  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { old_password, new_password, confirm_password } = changePasswordDto;

    if (new_password !== confirm_password) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatches = await argon2.verify(user.password, old_password);
    if (!passwordMatches) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = await argon2.hash(user.password);
    await this.usersRepository.save(user);
  }

}
