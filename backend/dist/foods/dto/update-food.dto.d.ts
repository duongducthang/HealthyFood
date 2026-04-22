import { FoodDetailDto } from "./food-detail.dto";
export declare class UpdateFoodDto {
    category?: string;
    title?: string;
    desc?: string;
    fullDesc?: string;
    imageUrl?: string;
    kcal?: number;
    details?: FoodDetailDto[];
}
