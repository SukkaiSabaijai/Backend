import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, ValidateIf } from "class-validator";

export class CreateReviewsDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  markerId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  rating: number;

  @IsOptional()
  @ValidateIf(o => o.review !== undefined)
  review?: string;
}
