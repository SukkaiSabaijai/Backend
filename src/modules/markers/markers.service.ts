import { BadRequestException, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Equal, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Marker } from './entities/marker.entity';
import { MarkerPic } from './entities/marker_pics.entity';
import { Grid } from './entities/grid.entity';
import { CreateMarkerDTO } from './dto/requests/create_marker.dto';
import { RestAreaCategory, ToiletCategory } from './entities/category.entity';
import { FindMarker } from './dto/requests/find_marker.dto';
import { ReturnMarker } from './dto/responses/return_marker.dto';
import { MarkerDetail } from './dto/responses/marker_detail.dto';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class MarkersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Marker) private markerRepository: Repository<Marker>,
        @InjectRepository(MarkerPic) private markerpicRepository: Repository<MarkerPic>,
        @InjectRepository(Grid) private gridRepository: Repository<Grid>,
        @InjectRepository(RestAreaCategory) private restareacategoryRepository: Repository<RestAreaCategory>,
        @InjectRepository(ToiletCategory) private tolietcategoryRepository: Repository<ToiletCategory>,
        private minioService:MinioService
    ) {}

    async create_marker( user_id : number, createMarkerDTO : CreateMarkerDTO, img: Express.Multer.File[]) {
        if (createMarkerDTO.type !== 'toilet' && createMarkerDTO.type !== 'rest_area') {
            throw new BadRequestException('Type not match');
        }

        const markerInArea = new FindMarker;
        markerInArea.type = createMarkerDTO.type;
        markerInArea.max_latitude = createMarkerDTO.latitude + 0.0001;
        markerInArea.min_latitude = createMarkerDTO.latitude - 0.0001;
        markerInArea.max_longitude = createMarkerDTO.longitude + 0.0001;
        markerInArea.min_longitude = createMarkerDTO.longitude - 0.0001;
        const exMarker = await this.find_marker(markerInArea);
        if (exMarker.length !== 0) {
            throw new BadRequestException('Marker already exist');
        }

        //find user
        const user = await this.userRepository.findOneBy({
            id: user_id
        });

        //find base level grid
        let grid = await this.gridRepository.findOneBy({
            level: Equal(0),
            min_latitude: LessThanOrEqual(createMarkerDTO.latitude),
            max_latitude: MoreThan(createMarkerDTO.latitude),
            min_longitude: LessThanOrEqual(createMarkerDTO.longitude),
            max_longitude: MoreThan(createMarkerDTO.longitude)
        });

        //find the smallest grid
        if (!grid) {
            grid = await this.create_grid(createMarkerDTO.latitude,createMarkerDTO.longitude);
        } else {
            let listOfGrid = await grid.child_grid
            //console.log(listOfGrid)
            while (listOfGrid.length > 0){
                grid = listOfGrid.pop()
                if (grid.min_latitude <= createMarkerDTO.latitude && 
                    grid.max_latitude > createMarkerDTO.latitude &&
                    grid.min_longitude <= createMarkerDTO.longitude &&
                    grid.max_longitude > createMarkerDTO.longitude
                ) {
                    //console.log("found")
                    listOfGrid = await grid.child_grid;
                }
            }
        }

        //subdivision grid
        if (grid.marker_count >= 50) {
            grid = await this.sub_grid(grid,createMarkerDTO.latitude,createMarkerDTO.longitude);
        }

        //upload image
        let markerPic: MarkerPic[] = [];
        for (const imgFile of img) {
            const path = await this.minioService.uploadFile(imgFile, 'marker-pics');
            const newMarkerPic = new MarkerPic();
            newMarkerPic.path = path;
            markerPic.push(newMarkerPic);
        }
        //console.log(markerPic);

        //create marker
        const newMarker = this.markerRepository.create({
            ...createMarkerDTO
        })
        if (createMarkerDTO.type === 'toilet') {
            const newToiletCategory = new ToiletCategory();
            createMarkerDTO.category.forEach((categoryName) => {
                newToiletCategory.disable = newToiletCategory.disable || categoryName === 'disable';
                newToiletCategory.flush = newToiletCategory.flush || categoryName === 'flush';
                newToiletCategory.hose = newToiletCategory.hose || categoryName === 'hose';
            })
            
            newMarker.toiletCategory = newToiletCategory;

        } else if (createMarkerDTO.type === 'rest_area') {
            const newRestAreaCategory = new RestAreaCategory();
            createMarkerDTO.category.forEach((categoryName) => {
                newRestAreaCategory.charger = newRestAreaCategory.charger || categoryName === 'charger';
                newRestAreaCategory.table = newRestAreaCategory.table || categoryName === 'table';
                newRestAreaCategory.wifi = newRestAreaCategory.wifi || categoryName === 'wifi';
            })
            
            newMarker.restAreaCategory = newRestAreaCategory;

        }
        newMarker.created_by = user;
        newMarker.grid_id = grid;
        newMarker.marker_pics = Promise.resolve(markerPic)

        await this.markerRepository.save(newMarker);
        grid.marker_count += 1;
        await this.gridRepository.save(grid);
        await this.userRepository.save(user);
        return {status:"success"};
        
    }

    private async create_grid( latitude: number, longitude: number): Promise<Grid> {
        let round_latitude = Math.floor(latitude*100);
        let round_longitude = Math.floor(longitude*100);
        //console.log(round_latitude);
        //console.log(round_longitude);
        const min_latitude = (round_latitude - (round_latitude % 25))/100;
        const min_longitude = (round_longitude- (round_longitude % 25))/100;
        //console.log(min_latitude);
        //console.log(min_longitude);
        const max_latitude = ((min_latitude*100) + 25)/100;
        const max_longitude = ((min_longitude*100) + 25)/100;
        //console.log(max_latitude);
        //console.log(max_longitude);
        const lenght = max_latitude - min_latitude;
        const neighbor = await this.gridRepository.findBy({
            min_latitude: MoreThanOrEqual(min_latitude - lenght),
            max_latitude: LessThanOrEqual(max_latitude + lenght),
            min_longitude: MoreThanOrEqual(min_longitude - lenght),
            max_longitude: LessThanOrEqual(max_longitude + lenght),
            level: Equal(0)
        });
        const newGrid = await this.gridRepository.create({
            max_latitude: max_latitude,
            min_latitude: min_latitude,
            max_longitude: max_longitude,
            min_longitude: min_longitude,
            neighbors_grid: neighbor
        });
        return await this.gridRepository.save(newGrid);
    } 

    private async sub_grid(grid: Grid, latitude: number, longitude: number): Promise<Grid> {
        let markers = await grid.markers;
        let lenght = (grid.max_latitude - grid.min_latitude)/2;
        //console.log(lenght);
        const level = grid.level + 1;
        const min_lat = [grid.min_latitude, grid.min_latitude + lenght, grid.min_latitude, grid.min_latitude + lenght];
        const max_lat = [grid.max_latitude - lenght, grid.max_latitude, grid.max_latitude - lenght, grid.max_latitude];
        const min_long = [grid.min_longitude, grid.min_longitude, grid.min_longitude + lenght, grid.min_longitude + lenght];
        const max_long = [grid.max_longitude - lenght, grid.max_longitude - lenght, grid.max_longitude, grid.max_longitude];

        let grids = [];
        for(let i = 0; i < 4; i++){
            let neighbor = await this.gridRepository.findBy({
                min_latitude: MoreThanOrEqual(min_lat[i] - lenght),
                max_latitude: LessThanOrEqual(max_lat[i] + lenght),
                min_longitude: MoreThanOrEqual(min_long[i] - lenght),
                max_longitude: LessThanOrEqual(max_long[i] + lenght),
                level: Equal(level)
            });
            let newGrid = await this.gridRepository.create({
                max_latitude: max_lat[i],
                min_latitude: min_lat[i],
                max_longitude: max_long[i],
                min_longitude: min_long[i],
                neighbors_grid: neighbor,
                level: level,
                parent_grid: grid                
            });
            grids.push(await this.gridRepository.save(newGrid));
        }
        for (let i = 0; i < markers.length; i++){
            let marker_grid:Grid;
            for (let j = 0; j < grids.length; j++){
                if(
                    grids[j].min_latitude <= markers[i].latitude && 
                    grids[j].max_latitude > markers[i].latitude &&
                    grids[j].min_longitude <= markers[i].longitude &&
                    grids[j].max_longitude > markers[i].longitude
                ){
                    marker_grid = grids[j];
                    marker_grid.marker_count += 1;
                    await this.gridRepository.save(marker_grid);
                    break;
                }
            }
            markers[i].grid_id = marker_grid;
            await this.markerRepository.save(markers[i]);
        }
        let returnGrid:Grid;
        for (let i = 0; i < grids.length; i++){
            if(
                grids[i].min_latitude <= latitude && 
                grids[i].max_latitude > latitude &&
                grids[i].min_longitude <= longitude &&
                grids[i].max_longitude > longitude
            ){
                returnGrid = grids[i];
                break;
            }            
        }
        return returnGrid;
    }

    async find_marker(findMarker: FindMarker): Promise<ReturnMarker[]>{
        //find base level grid
        let grids = await this.gridRepository.findBy({
            level: Equal(0),
            min_latitude: LessThanOrEqual(findMarker.max_latitude),
            max_latitude: MoreThanOrEqual(findMarker.min_latitude),
            min_longitude: LessThanOrEqual(findMarker.max_longitude),
            max_longitude: MoreThanOrEqual(findMarker.min_longitude)
        });

        //find all grid
        let returnGrids: Grid[] = [];
        while (grids.length > 0) {
            let grid = grids[0];
            let listOfGrid = await grid.child_grid;

            if (listOfGrid.length === 0){
                returnGrids.push(grid);
            } else {
                while (listOfGrid.length > 0){
                    grid = listOfGrid.pop()
                    if (grid.min_latitude <= findMarker.max_latitude && 
                        grid.max_latitude >= findMarker.min_latitude &&
                        grid.min_longitude <= findMarker.max_longitude &&
                        grid.max_longitude >= findMarker.min_longitude
                    ) {
                        //console.log(grid);
                        grids.push(grid);
                    }
                }
            }
            grids.shift();
        }
        //console.log(returnGrids);

        //find all markers
        let returnMarkers: Marker[] = [];
        for (let i = 0; i < returnGrids.length; i++){
            returnMarkers = returnMarkers.concat(await returnGrids[i].markers);
        }
        //console.log(returnMarkers);
        
        //filter
        let filterMarkers: ReturnMarker[] = [];
        for (let i = 0; i < returnMarkers.length; i++){
            if (returnMarkers[i].latitude < findMarker.min_latitude || 
                returnMarkers[i].latitude > findMarker.max_latitude ||
                returnMarkers[i].longitude < findMarker.min_longitude ||
                returnMarkers[i].longitude > findMarker.max_longitude ||
                returnMarkers[i].type !== findMarker.type
            ) {
                continue;
            }
            if (findMarker.price !== undefined) {
                if (returnMarkers[i].price > findMarker.price){
                    continue;
                }
            }
            if (findMarker.rating !== undefined) {
                let rating = returnMarkers[i].review_count > 0 ? returnMarkers[i].review_total_score/returnMarkers[i].review_count:0;
                if (rating < findMarker.rating){
                    continue;
                }
            }
            if (findMarker.type === "toilet"){
                if (
                    await this.filter_condition(returnMarkers[i].toiletCategory.disable,findMarker.disable) ||
                    await this.filter_condition(returnMarkers[i].toiletCategory.flush,findMarker.flush) ||
                    await this.filter_condition(returnMarkers[i].toiletCategory.hose,findMarker.hose)
                ){
                    continue;
                }
            } else if (findMarker.type === "rest_area"){
                if (
                    await this.filter_condition(returnMarkers[i].restAreaCategory.charger,findMarker.charger) ||
                    await this.filter_condition(returnMarkers[i].restAreaCategory.table,findMarker.table) ||
                    await this.filter_condition(returnMarkers[i].restAreaCategory.wifi,findMarker.wifi) 
                ){
                    continue;
                }
            }
            let newReturnMarker = new ReturnMarker();
            newReturnMarker.id = returnMarkers[i].id;
            newReturnMarker.latitude = returnMarkers[i].latitude;
            newReturnMarker.longitude = returnMarkers[i].longitude;
            newReturnMarker.rating = returnMarkers[i].review_count > 0 ? returnMarkers[i].review_total_score/returnMarkers[i].review_count:0;
            filterMarkers.push(newReturnMarker);
        }
        

        return filterMarkers
    }

    async filter_condition(inp: boolean, filter: boolean): Promise<boolean>{
        //console.log((inp === false && filter === true))
        return (inp === false && filter === true);
    }

    async get_marker_detail(marker_id:number): Promise<MarkerDetail> {
        console.log(marker_id)
        const marker = await this.markerRepository.findOne({
            where: { id: marker_id }
        })
        if (!marker) {
            throw new BadRequestException('Marker not exist');
        }
        let category = [];
        if (marker.type === "toilet") {
            if (marker.toiletCategory.disable){category.push("disable");}
            if (marker.toiletCategory.hose){category.push("hose");}
            if (marker.toiletCategory.flush){category.push("flush");}
        } else if (marker.type === "rest_area") {
            if (marker.restAreaCategory.charger){category.push("charger");}
            if (marker.restAreaCategory.wifi){category.push("wifi");}
            if (marker.restAreaCategory.table){category.push("table");}
        }
        const marker_pic = await marker.marker_pics;
        let img_path: string[] = [];
        marker_pic.forEach((img) => {
            img_path.push(img.path);
        })

        const newMarkerDetail = new MarkerDetail();
        newMarkerDetail.created_by = marker.created_by.username;
        newMarkerDetail.latitude =  marker.latitude;
        newMarkerDetail.longitude = marker.longitude;
        newMarkerDetail.location_name = marker.location_name;
        newMarkerDetail.type = marker.type; 
        newMarkerDetail.detail = marker.detail;
        newMarkerDetail.avg_rating = marker.review_count > 0? marker.review_total_score/marker.review_count : 0;
        newMarkerDetail.category = category;
        newMarkerDetail.img = img_path;

        return newMarkerDetail
    }

    async delete_marker(marker_id:number, user_id:number) {
        const marker = await this.markerRepository.findOneBy({id: marker_id});
        if (!marker) {
            throw new BadRequestException('Marker not found');
        }
        if (marker.created_by.id !== user_id){
            throw new UnauthorizedException('No permission')
        }
        const imgs = await marker.marker_pics;
        for (const imgFile of imgs) {
            await this.minioService.deleteFile(imgFile.path);
        }
        await this.markerRepository.remove(marker)
        return {status:"success"};
    }
}
