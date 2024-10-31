export class GetReviewDTO{
    markerId: number;
    avgRating: number;
    reviewCount: number;
    reviews: ReturnReview[]; 
}
export class ReturnReview{
    username: string;
    userPic: string;
    rating: number;
    review: string;
}