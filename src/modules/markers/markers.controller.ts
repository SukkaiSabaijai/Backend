import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { CreateMarkerDTO } from './dto/requests/create_marker.dto';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { FindMarker } from './dto/requests/find_marker.dto';
import { MarkerDetail } from './dto/responses/marker_detail.dto';

@Controller('markers')
export class MarkersController {
    constructor(private readonly markersService: MarkersService){}
    
    @UseGuards(AccessTokenGuard)
    @Post('create')
    async create_marker(@Req() req, @Body() createMarkerDTO:CreateMarkerDTO){
        if (createMarkerDTO.type === 'toilet'){
            if (createMarkerDTO.charger|| createMarkerDTO.wifi || createMarkerDTO.table){
                throw new BadRequestException('Filter mismatch');
            }
        } else if (createMarkerDTO.type === 'rest_area'){
            if (createMarkerDTO.disable || createMarkerDTO.flush || createMarkerDTO.hose){
                throw new BadRequestException('Filter mismatch');
            }
        } else {
            throw new BadRequestException('Incorrect type');
        }
        return this.markersService.create_marker(req.user['sub'],createMarkerDTO);
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async find(@Query() query: FindMarker){
        if (query.type === "toilet"){
            if (query.charger|| query.wifi || query.table){
                throw new BadRequestException('Filter mismatch');
            }
        } else if (query.type === "rest_area"){
            if (query.disable || query.flush || query.hose){
                throw new BadRequestException('Filter mismatch');
            }
        } else {
            throw new BadRequestException('Incorrect type');
        }
        return await this.markersService.find_marker(query);
    }

    @Get(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async show_detail (@Param('id', ParseIntPipe) marker_id: number): Promise<MarkerDetail> {
        return await this.markersService.get_marker_detail(marker_id);
    }
}
