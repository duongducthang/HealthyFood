import { FoodDetailDto } from "./food-detail.dto";
export declare class CreateFoodDto {
    title: string;
    category?: string;
    kcal?: number;
    desc?: string;
    fullDesc?: string;
    imageUrl?: string;
    details?: FoodDetailDto[];
}
