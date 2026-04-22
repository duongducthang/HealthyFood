import { HealthService } from './health.service';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    health(): {
        ok: boolean;
        uptime: number;
    };
    getHistory(req: any): Promise<(import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {})[]>;
    getDetail(req: any, id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
    trackBMI(req: any, data: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
    updateHealth(req: any, id: string, data: any): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
    deleteHealth(req: any, id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        weight: number;
        height: number | null;
        bmi: number | null;
        date: Date;
    }, unknown> & {}>;
}
