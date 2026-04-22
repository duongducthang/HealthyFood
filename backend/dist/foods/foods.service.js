"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FoodsService = class FoodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(query) {
        const where = {};
        if (query.category)
            where.category = query.category;
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: "insensitive" } },
                { desc: { contains: query.search, mode: "insensitive" } },
                { fullDesc: { contains: query.search, mode: "insensitive" } },
            ];
        }
        const foods = await this.prisma.food.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });
        return { foods };
    }
    async get(id) {
        const food = await this.prisma.food.findUnique({
            where: { id },
        });
        if (!food)
            throw new common_1.NotFoundException("Food not found");
        return { food };
    }
    async create(dto) {
        const food = await this.prisma.food.create({
            data: {
                title: dto.title,
                desc: dto.desc,
                kcal: Number(dto.kcal) || 0,
                category: dto.category,
                fullDesc: dto.fullDesc,
                imageUrl: dto.imageUrl,
                details: dto.details,
            },
        });
        return { food };
    }
    async update(id, dto) {
        const existing = await this.prisma.food.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException("Food not found");
        const food = await this.prisma.food.update({
            where: { id },
            data: {
                title: dto.title,
                desc: dto.desc,
                kcal: dto.kcal !== undefined ? Number(dto.kcal) : undefined,
                category: dto.category,
                fullDesc: dto.fullDesc,
                imageUrl: dto.imageUrl,
                details: dto.details,
            },
        });
        return { food };
    }
    async remove(id) {
        const existing = await this.prisma.food.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException("Food not found");
        await this.prisma.food.delete({
            where: { id },
        });
        return { message: "Deleted successfully" };
    }
};
exports.FoodsService = FoodsService;
exports.FoodsService = FoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FoodsService);
//# sourceMappingURL=foods.service.js.map