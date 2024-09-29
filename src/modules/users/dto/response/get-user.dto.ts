import { Exclude, Expose } from 'class-transformer';

export class GetUserDto {
    @Expose()
    id: number;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    gender?: string;

    @Expose()
    date_of_birth?: Date;

    @Expose()
    user_pic?: string;
}
