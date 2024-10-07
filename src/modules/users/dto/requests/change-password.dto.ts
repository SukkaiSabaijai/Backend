import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    old_password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: 'new password must be at least 8 characters long' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, {
        message: 'new password must contain at least one letter and one number',
    })
    new_password: string;

    @IsString()
    @IsNotEmpty()
    confirm_password: string;
}
