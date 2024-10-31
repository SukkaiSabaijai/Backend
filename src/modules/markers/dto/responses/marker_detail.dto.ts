export class MarkerDetail{
    id: number;
    isBookMark: boolean;
    created_by: string;
    latitude: number;
    longitude: number;
    location_name: string;
    type: string;
    detail: string;
    avg_rating: number;
    price: number;
    category: string[];
    img: string[] = [];
}
