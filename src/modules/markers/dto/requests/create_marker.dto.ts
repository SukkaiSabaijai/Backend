import { IsOptional } from "class-validator"

export class CreateMarkerDTO {
    latitude: number;

    longitude: number;

    type: string;

    location_name: string;

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
    price: number = 0;
}
