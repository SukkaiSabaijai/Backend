import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class FindMarker {
    type: string;

    max_latitude: number;

    min_latitude: number;

    max_longitude: number;

    min_longitude: number;

    zoom_scale: number;

    @Transform(({ value }) => value === 'true')
    disable?: boolean;

    @Transform(({ value }) => value === 'true')
    hose: boolean = false;

    @Transform(({ value }) => value === 'true')
    flush: boolean = false;

    @Transform(({ value }) => value === 'true')
    table: boolean = false;

    @Transform(({ value }) => value === 'true')
    charger: boolean = false;

    @Transform(({ value }) => value === 'true')
    wifi: boolean = false;

    @IsOptional()
    price: number;

    @IsOptional()
    rating: number;
}