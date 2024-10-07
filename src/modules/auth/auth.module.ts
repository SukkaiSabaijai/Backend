import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MinioModule } from '../minio/minio.module';

@Module({
	imports: [JwtModule.register({}), UsersModule, MinioModule],
	controllers: [AuthController],
	providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule { }
