import { Transform, Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, isString, IsString } from "class-validator";

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

    @Type(() => Boolean)
    @IsBoolean()
    disable: boolean = false;

    @Type(() => Boolean)
    @IsBoolean()
    hose: boolean = false;

    @Type(() => Boolean)
    @IsBoolean()
    flush: boolean = false;

    @Type(() => Boolean)
    @IsBoolean()
    table: boolean = false;

    @Type(() => Boolean)
    @IsBoolean()
    charger: boolean = false;

    @Type(() => Boolean)
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