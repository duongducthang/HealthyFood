import { PrismaService } from '../prisma/prisma.service';
import { CreateCalorieLogDto } from './dto/create-calorie-log.dto';
import { UpdateCalorieLogDto } from './dto/update-calorie-log.dto';
export declare class CaloriesService {
    private prisma;
    constructor(prisma: PrismaService);
    private toFeLog;
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
    findOne(id: string): Promise<any>;
    create(dto: CreateCalorieLogDto): Promise<{
        log: any;
    }>;
    update(id: string, dto: UpdateCalorieLogDto): Promise<{
        log: any;
    }>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
