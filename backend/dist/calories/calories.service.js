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
exports.CaloriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CaloriesService = class CaloriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    toFeLog(log) {
        return {
            ...log,
            food: log.foodName,
            kcal: log.calories,
        };
    }
    async list(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const [logs, total] = await Promise.all([
            this.prisma.calorieLog.findMany({
                orderBy: { date: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.calorieLog.count(),
        ]);
        return {
            logs: logs.map((log) => this.toFeLog(log)),
            meta: {
                page,
                limit,
                total,
            },
        };
    }
    async findOne(id) {
        const log = await this.prisma.calorieLog.findUnique({
            where: { id },
        });
        if (!log) {
            throw new common_1.NotFoundException(`Không tìm thấy nhật ký với ID: ${id}`);
        }
        return this.toFeLog(log);
    }
    async create(dto) {
        if (!dto.food || dto.kcal === undefined || dto.kcal === null) {
            throw new Error("Missing required fields");
        }
        const log = await this.prisma.calorieLog.create({
            data: {
                foodName: dto.food,
                unit: dto.unit,
                qty: dto.qty,
                calories: Number(dto.kcal),
                date: dto.date ? new Date(dto.date) : new Date(),
            },
        });
        return { log: this.toFeLog(log) };
    }
    async update(id, dto) {
        const existing = await this.prisma.calorieLog.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException();
        const log = await this.prisma.calorieLog.update({
            where: { id },
            data: {
                ...(dto.food && { foodName: dto.food }),
                ...(dto.unit !== undefined && { unit: dto.unit }),
                ...(dto.qty !== undefined && { qty: dto.qty }),
                ...(dto.kcal !== undefined && dto.kcal !== null && { calories: Number(dto.kcal) }),
                ...(dto.date && { date: new Date(dto.date) }),
            },
        });
        return { log: this.toFeLog(log) };
    }
    async remove(id) {
        const existing = await this.prisma.calorieLog.findUnique({
            where: { id },
        });
        if (!existing)
            throw new common_1.NotFoundException();
        await this.prisma.calorieLog.delete({
            where: { id },
        });
        return { ok: true };
    }
};
exports.CaloriesService = CaloriesService;
exports.CaloriesService = CaloriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CaloriesService);
//# sourceMappingURL=calories.service.js.map