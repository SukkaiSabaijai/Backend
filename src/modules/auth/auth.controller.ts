import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Req,
	UseGuards,
	Logger,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/requests/create-user.dto';
import { AuthDto } from './dto/requests/auth.dto';
import { AccessTokenGuard } from '../../common/accessToken.guard';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenGuard } from '../../common/refreshToken.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }
	@Post('signup')
	@UseInterceptors(FileInterceptor('profile_pic'))
	signup(@Body() createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
		return this.authService.signUp(createUserDto, file);
	}

	@Post('signin')
	signin(@Body() data: AuthDto) {
		return this.authService.signIn(data);
	}

	@UseGuards(AccessTokenGuard)
	@Get('logout')
	logout(@Req() req) {
		console.log(req.user);
		this.authService.logout(req.user['sub']);
	}

	@UseGuards(RefreshTokenGuard)
	@Get('refresh')
	refreshTokens(@Req() req) {
		const userId = req.user['sub'];
		const refreshToken = req.user['refreshToken'];
		return this.authService.refreshTokens(userId, refreshToken);
	}
}
