import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { CaloriesService } from './calories.service';
import { CreateCalorieLogDto } from './dto/create-calorie-log.dto';
import { UpdateCalorieLogDto } from './dto/update-calorie-log.dto';

@Controller('calories')
export class CaloriesController {
  [x: string]: any;
  constructor(private readonly service: CaloriesService) {}

  
  @Get('logs')
  list(@Query() query: { page?: number; limit?: number }) {
    return this.service.list(query);
  }

  
  @Get('logs/:id')
  getOne(@Param('id') id: string) {
    return this.service.findOne(id); 
  }
  

  @Post('logs')
  create(@Body() dto: CreateCalorieLogDto) {
    return this.service.create(dto);
  }

  @Put('logs/:id')
  updateFull(@Param('id') id: string, @Body() dto: UpdateCalorieLogDto) {
    return this.service.update(id, dto);
  }

  @Patch('logs/:id')
  updatePartial(@Param('id') id: string, @Body() dto: UpdateCalorieLogDto) {
    return this.service.update(id, dto);
  }

  @Delete('logs/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}