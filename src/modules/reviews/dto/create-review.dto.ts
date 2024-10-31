import { IsNotEmpty, IsOptional, ValidateIf } from "class-validator";

export class CreateReviewsDto {
  @IsNotEmpty()
  markerId: number;

  @IsNotEmpty()
  rating: number;

  @IsOptional()
  @ValidateIf(o => o.review !== undefined)
  review?: string;
}
