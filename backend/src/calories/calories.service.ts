import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalorieLogDto } from './dto/create-calorie-log.dto';
import { UpdateCalorieLogDto } from './dto/update-calorie-log.dto';

@Injectable()
export class CaloriesService {
  constructor(private prisma: PrismaService) {}

  private toFeLog(log: any) {
    return {
      ...log,
      food: log.foodName,
      kcal: log.calories,
    };
  }

  async list(query: { page?: number; limit?: number }) {
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

  
  async findOne(id: string) {
    const log = await this.prisma.calorieLog.findUnique({
      where: { id },
    });

    if (!log) {
      throw new NotFoundException(`Không tìm thấy nhật ký với ID: ${id}`);
    }

    return this.toFeLog(log);
  }


  async create(dto: CreateCalorieLogDto) {
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

  async update(id: string, dto: UpdateCalorieLogDto) {
    const existing = await this.prisma.calorieLog.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

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

  async remove(id: string) {
    const existing = await this.prisma.calorieLog.findUnique({
      where: { id },
    });

    if (!existing) throw new NotFoundException();

    await this.prisma.calorieLog.delete({
      where: { id },
    });

    return { ok: true };
  }
}