import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator"

export enum MarkerType {
    TOILET = 'toilet',
    REST_AREA = 'rest_area'
}

export enum Category {
    CHARGER = 'charger',
    TABLE = 'table',
    WIFI = 'wifi',
    DISABLE = 'disable',
    FLUSH = 'flush',
    HOSE = 'hose',
}

export class CreateMarkerDTO {
    @IsNumber()
    @Type(() => Number)
    latitude: number;

    @IsNumber()
    @Type(() => Number)
    longitude: number;

    @IsEnum(MarkerType, {message: 'Incorrect type'})
    type: string;

    @IsString()
    location_name: string;

    @IsString()
    detail: string;

    @IsOptional()
    @IsEnum(Category, { each: true ,message: 'Incorrect type' })
    category: string[] = [];

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    price: number = 0;
}
