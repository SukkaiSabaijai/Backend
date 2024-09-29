import { Controller, Post } from '@nestjs/common';
import { Marker } from './entities/marker.entity';
import { MarkersService } from './markers.service';

@Controller('markers')
export class MarkersController {
    constructor(private readonly markersService: MarkersService) {}

    @Post()
    async postMarker(): Promise<Marker> {
        return this.markersService.createMarker()
    }
}
