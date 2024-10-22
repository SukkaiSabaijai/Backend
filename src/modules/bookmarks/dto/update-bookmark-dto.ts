import { IsNotEmpty } from "class-validator";

export class UpdateBookmarkDto {
    @IsNotEmpty() 
    nickname: string;
}