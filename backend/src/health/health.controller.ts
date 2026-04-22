import { Body, Controller, Get, Post, Put, Delete, Param, Request, UseGuards, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HealthService } from './health.service';

@Controller('health')
@UseGuards(JwtAuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  
  @Get('status')
  health() {
    return { ok: true, uptime: process.uptime() };
  }

 
  @Get('history')
  async getHistory(@Request() req) {
    return this.healthService.findAll(req.user.userId);
  }

  
  @Get(':id')
  async getDetail(@Request() req, @Param('id') id: string) {
    return this.healthService.findOne(req.user.userId, id);
  }

  
  @Post('bmi')
  async trackBMI(@Request() req, @Body() data: any) { 
    
    if (!data || Object.keys(data).length === 0) {
      throw new BadRequestException('Body dữ liệu không được để trống');
    }
    return this.healthService.create(req.user.userId, data);
  }


  @Put(':id')
  async updateHealth(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.healthService.update(req.user.userId, id, data);
  }

  
  @Delete(':id')
  async deleteHealth(@Request() req, @Param('id') id: string) {
    return this.healthService.remove(req.user.userId, id);
  }
}