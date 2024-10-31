import { Expose } from 'class-transformer';

export class GetUserDto {
    @Expose()
    id: number;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    username: string;
}
