import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UsersService } from "./users.service";
import { UpdateMeDto } from "./dto/update-me.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AddressDto } from "./dto/address.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  [x: string]: any;
  constructor(private readonly users: UsersService) {}


  @Get()
  findAll() {
  return this.users.findAll();
 }

  @Get("me")
  me(@Req() req: any) {
    return this.users.me(req.user.userId);
  }

  
  @Get(":id")
  getById(@Param("id") id: string) {
    return this.users.getById(id);
  }

  @Post()
  async create(@Body() createUserDto: any) {
    return this.users.create(createUserDto);
  }

  @Put("me")
  updateMe(@Req() req: any, @Body() dto: UpdateMeDto) {
    return this.users.update(req.user.userId, dto);
  }

 
  @Put(":id")
  updateById(@Param("id") id: string, @Body() dto: UpdateMeDto) {
    return this.users.update(id, dto);
  }

  @Put("me/password")
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    console.log("body >>> ", dto)
    return this.users.changePassword(req.user.userId, dto);

  }
  
  @Delete(":id")
  deleteUser(@Param("id") id: string) {
    return this.users.deleteUser(id);
  }


  @Get("me/addresses")
  listAddresses(@Req() req: any) {
    return this.users.listAddresses(req.user.userId);
  }

  @Get("me/addresses/detail/:id")
  getAddressById(
    @Req() req: any,
    @Param("id") id: string
  ) {
    return this.users.getAddressById(req.user.userId, id);
  }
  
  @Post("me/addresses")
  createAddress(
    @Req() req,
    @Body() dto: AddressDto
  ) {
    const userId = req.user.userId; 
    return this.users.createAddress(userId, dto);
  }

  @Put("me/addresses/:id")
  updateAddress(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: Partial<AddressDto>
  ) {
    return this.users.updateAddress(req.user.userId, id, dto);
  }

  @Delete("me/addresses/:id")
  deleteAddress(@Req() req: any, @Param("id") id: string) {
    return this.users.deleteAddress(req.user.userId, id);
  }
}