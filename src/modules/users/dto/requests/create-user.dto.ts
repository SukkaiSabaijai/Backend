import {
  IsDate,
  IsEmail,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Gender } from '../../entities/gender.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'username must be at least 4 characters long' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsEmail({}, { message: 'invalid email address' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'gender must be one of the predefined values' })
  gender?: Gender;

  @IsOptional()
  @IsISO8601({}, { message: 'invalid date format' })
  date_of_birth?: Date;

  @IsOptional()
  @IsString()
  user_pic?: string;
}
