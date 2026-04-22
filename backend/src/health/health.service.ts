import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  
  async findAll(userId: string) {
    return this.prisma.healthMetric.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  
  async findOne(userId: string, id: string) {
    const record = await this.prisma.healthMetric.findFirst({
      where: {
        id,
        userId, 
      },
    });

    if (!record) {
      throw new ForbiddenException('Không có quyền hoặc không tồn tại');
    }

    return record;
  }

  
  async create(userId: string, dto: any) {
    const weight = Number(dto.weight);
    const height = Number(dto.height);

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      throw new BadRequestException('Cân nặng và chiều cao phải hợp lệ');
    }

    const heightInMeters = height / 100;
    const bmi =
      Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;

    return this.prisma.healthMetric.create({
      data: {
        userId,
        weight,
        height,
        bmi,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });
  }

  
  async update(userId: string, id: string, dto: any) {
    if (!dto) {
      throw new BadRequestException('Dữ liệu không được để trống');
    }

    const record = await this.prisma.healthMetric.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!record) {
      throw new ForbiddenException('Không có quyền hoặc không tồn tại');
    }

    return this.prisma.healthMetric.update({
      where: { id },
      data: {
        weight: dto.weight ? Number(dto.weight) : record.weight,
        height: dto.height ? Number(dto.height) : record.height,
        date: dto.date ? new Date(dto.date) : record.date,
      },
    });
  }

  
  async remove(userId: string, id: string) {
    const record = await this.prisma.healthMetric.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!record) {
      throw new ForbiddenException('Không có quyền hoặc không tồn tại');
    }

    return this.prisma.healthMetric.delete({
      where: { id },
    });
  }
}