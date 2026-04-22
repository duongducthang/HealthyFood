import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { FoodsService } from "./foods.service";
import { CreateFoodDto } from "./dto/create-food.dto";
import { UpdateFoodDto } from "./dto/update-food.dto";

@Controller("foods")
export class FoodsController {
  constructor(private readonly foods: FoodsService) {}

  
  @Get()
  list(
  @Query("category") category?: string,
  @Query("search") search?: string
) {
  const query: any = {};

  if (category) query.category = category;
  if (search) query.search = search;

  return this.foods.list(query);
}
  @Get(":id")
  get(@Param("id") id: string) {
    return this.foods.get(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFoodDto) {
    return this.foods.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateFoodDto) {
    return this.foods.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.foods.remove(id);
  }
}

