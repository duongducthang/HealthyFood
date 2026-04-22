import { PrismaService } from "../prisma/prisma.service";
export declare class FoodsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(query: {
        category?: string;
        search?: string;
    }): Promise<{
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
    create(dto: any): Promise<{
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
    update(id: string, dto: any): Promise<{
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
