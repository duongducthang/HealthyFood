import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FoodsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: { category?: string; search?: string }) {
    const where: any = {};

    if (query.category) where.category = query.category;

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

  async get(id: string) {
    const food = await this.prisma.food.findUnique({
      where: { id },
    });

    if (!food) throw new NotFoundException("Food not found");

    return { food };
  }

  async create(dto: any) {
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

  async update(id: string, dto: any) {
    const existing = await this.prisma.food.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException("Food not found");

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

  async remove(id: string) {
    const existing = await this.prisma.food.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException("Food not found");

    await this.prisma.food.delete({
      where: { id },
    });

    return { message: "Deleted successfully" };
  }
}