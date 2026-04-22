import { FoodsService } from "./foods.service";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";
export declare class FoodsController {
    private readonly foods;
    constructor(foods: FoodsService);
    list(category?: string, search?: string): Promise<{
        foods: (import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            desc: string | null;
            kcal: number;
            category: string;
            fullDesc: string | null;
            imageUrl: string | null;
            details: import(".prisma/client").Prisma.JsonValue | null;
            createdAt: Date;
        }, unknown> & {})[];
    }>;
    get(id: string): Promise<{
        food: import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            desc: string | null;
            kcal: number;
            category: string;
            fullDesc: string | null;
            imageUrl: string | null;
            details: import(".prisma/client").Prisma.JsonValue | null;
            createdAt: Date;
        }, unknown> & {};
    }>;
    create(dto: CreateFoodDto): Promise<{
        food: import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            desc: string | null;
            kcal: number;
            category: string;
            fullDesc: string | null;
            imageUrl: string | null;
            details: import(".prisma/client").Prisma.JsonValue | null;
            createdAt: Date;
        }, unknown> & {};
    }>;
    update(id: string, dto: UpdateFoodDto): Promise<{
        food: import("@prisma/client/runtime").GetResult<{
            id: string;
            title: string;
            desc: string | null;
            kcal: number;
            category: string;
            fullDesc: string | null;
            imageUrl: string | null;
            details: import(".prisma/client").Prisma.JsonValue | null;
            createdAt: Date;
        }, unknown> & {};
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
