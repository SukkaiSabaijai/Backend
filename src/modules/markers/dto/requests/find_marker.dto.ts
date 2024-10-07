import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class FindMarker {
    @IsString()
    type: string;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    max_latitude: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    min_latitude: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    max_longitude: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    min_longitude: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    zoom_scale: number;

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
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    price: number;

    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    rating: number;
}