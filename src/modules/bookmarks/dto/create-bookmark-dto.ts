import { IsNotEmpty } from "class-validator";

export class CreateBookmarkDto {

    @IsNotEmpty()
    markerId: number;

    @IsNotEmpty()
    nickname: string;
}