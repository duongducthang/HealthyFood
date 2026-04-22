import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {})[]>;
    findOne(userId: string, id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
    create(userId: string, dto: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
    update(userId: string, id: string, dto: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
    remove(userId: string, id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
}
