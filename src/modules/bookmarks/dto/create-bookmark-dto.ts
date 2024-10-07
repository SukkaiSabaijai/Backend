import { IsNotEmpty } from "class-validator";

export class CreateBookmarkDto{

    @IsNotEmpty()
    markerId: number;
    
    nickname: string;
}