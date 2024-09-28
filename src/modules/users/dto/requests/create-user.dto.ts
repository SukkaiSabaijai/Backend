import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional() // Made optional in case not required during creation
  gender?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Username must be at least 4 characters long' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsOptional()
  @IsString()
  user_pic?: string; // Added optional user picture field
}
