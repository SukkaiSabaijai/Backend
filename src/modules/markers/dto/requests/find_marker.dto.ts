import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class FindMarker {
    @IsString()
    type: string;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    max_latitude: number;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    min_latitude: number;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    max_longitude: number;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    min_longitude: number;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    disable: boolean = false;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    hose: boolean = false;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    flush: boolean = false;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    table: boolean = false;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    charger: boolean = false;

    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    wifi: boolean = false;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    price: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    rating: number;
}