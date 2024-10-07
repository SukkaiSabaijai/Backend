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
    disable: boolean = false;

    @IsOptional()
    hose: boolean = false;

    @IsOptional()
    flush: boolean = false;

    @IsOptional()
    table: boolean = false;

    @IsOptional()
    charger: boolean = false;

    @IsOptional()
    wifi: boolean = false;
    
    @IsOptional()
    @IsNumber()
    price: number = 0;
}
