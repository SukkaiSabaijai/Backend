import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MarkersService } from './markers.service';
import { Category, CreateMarkerDTO, MarkerType } from './dto/requests/create_marker.dto';
import { AccessTokenGuard } from 'src/common/accessToken.guard';
import { FindMarker } from './dto/requests/find_marker.dto';
import { MarkerDetail } from './dto/responses/marker_detail.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OptionalAuthGuard } from '../auth/strategies/optionalToken.strategy';

@Controller('markers')
export class MarkersController {
    constructor(private readonly markersService: MarkersService) { }

    @UseGuards(AccessTokenGuard)
    @UseInterceptors(FilesInterceptor('img', 5))
    @Post('create')
    async create_marker(@Req() req, @Body() createMarkerDTO: CreateMarkerDTO, @UploadedFiles() img: Express.Multer.File[]) {
        //console.log(createMarkerDTO);
        //console.log(img)
        //console.log(req)

        const validCategoriesMap = {
            [MarkerType.REST_AREA]: [Category.CHARGER, Category.TABLE, Category.WIFI],
            [MarkerType.TOILET]: [Category.DISABLE, Category.FLUSH, Category.HOSE],
        };

        const validCategories = validCategoriesMap[createMarkerDTO.type];
        const isValidCategory = createMarkerDTO.category.every(categoryName => validCategories.includes(categoryName));
        if (!isValidCategory) {
            throw new BadRequestException('Filter mismatch');
        }

        return this.markersService.create_marker(req.user['sub'], createMarkerDTO, img);
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async find(@Query() query: FindMarker) {
        //console.log(query)
        if (query.type === "toilet") {
            if (query.charger || query.wifi || query.table) {
                throw new BadRequestException('Filter mismatch');
            }
        } else if (query.type === "rest_area") {
            if (query.disable || query.flush || query.hose) {
                throw new BadRequestException('Filter mismatch');
            }
        } else {
            throw new BadRequestException('Incorrect type');
        }
        return await this.markersService.find_marker(query);
    }

    @UseGuards(OptionalAuthGuard)
    @Get(':id')
    @UsePipes(new ValidationPipe({ transform: true }))
    async show_detail(@Req() req, @Param('id', ParseIntPipe) marker_id: number): Promise<MarkerDetail> {
        const userId = req.user?.sub; // Assuming `sub` is userId in your JWT payload
        return await this.markersService.get_marker_detail(marker_id, userId);
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    async delete_marker(@Param('id') marker_id: number, @Req() req) {
        const user_id = req.user['sub'];
        return await this.markersService.delete_marker(marker_id, user_id)
    }
}
