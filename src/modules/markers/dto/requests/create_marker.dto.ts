import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateMarkerDTO {
    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsString()
    type: string;

    @IsString()
    location_name: string;

    @IsString()
    detail: string;

    @IsOptional()
    category: string[] = [];

    @IsOptional()
    @IsNumber()
    price: number = 0;
}
