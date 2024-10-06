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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from '../../common/accessToken.guard';
import { GetUserDto } from './dto/response/get-user.dto';
import { ChangePasswordDto } from './dto/requests/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {

  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  @UseInterceptors(FileInterceptor('profile_pic'))
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto, @UploadedFile() file: Express.Multer.File): Promise<GetUserDto> {
    const userId = req.user['sub']
    return this.usersService.update(userId, updateUserDto, file);
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
