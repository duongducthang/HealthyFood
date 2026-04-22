import { CaloriesService } from './calories.service';
import { CreateCalorieLogDto } from './dto/create-calorie-log.dto';
import { UpdateCalorieLogDto } from './dto/update-calorie-log.dto';
export declare class CaloriesController {
    private readonly service;
    [x: string]: any;
    constructor(service: CaloriesService);
    list(query: {
        page?: number;
        limit?: number;
    }): Promise<{
        logs: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getOne(id: string): Promise<any>;
    create(dto: CreateCalorieLogDto): Promise<{
        log: any;
    }>;
    updateFull(id: string, dto: UpdateCalorieLogDto): Promise<{
        log: any;
    }>;
    updatePartial(id: string, dto: UpdateCalorieLogDto): Promise<{
        log: any;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
