import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from '../../common/accessToken.guard';
import { GetUserDto } from './dto/response/get-user.dto';
import { ChangePasswordDto } from './dto/requests/change-password.dto';

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {

  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto): Promise<GetUserDto> {
    const userId = req.user['sub']
    return this.usersService.update(userId, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/change-password')
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const userId = req.user['sub']
    return this.usersService.changePassword(userId, changePasswordDto);
  }
}
