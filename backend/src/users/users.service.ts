import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateMeDto } from "./dto/update-me.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AddressDto } from "./dto/address.dto";

function publicUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    userName: user.userName,
    fullName: user.fullName,
    phone: user.phone,
    gender: user.gender,
    birthday: user.birthday,
    avatar: user.avatar,
    age: user.age,
    createdAt: user.createdAt,
  };
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        userName: dto.userName,
        passwordHash,
      },
    });

    return { user: publicUser(user) };
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: "Xóa người dùng thành công",
      ok: true,
    };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) throw new NotFoundException("Not found");

    return {
      user: publicUser(user),
      addresses: user.addresses,
    };
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với ID: ${id}`
      );
    }

    return {
      user: publicUser(user),
      addresses: user.addresses,
    };
  }

  async update(userId: string, dto: UpdateMeDto) {
    const data: any = {
      email: dto.email,
      userName: dto.userName,
      fullName: dto.fullName,
      phone: dto.phone,
      gender: dto.gender,
      birthday: dto.birthday,
      avatar: dto.avatar,
    };

    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key]
    );

    if (dto.birthday) {
      const birthDate = new Date(dto.birthday);
      if (!isNaN(birthDate.getTime())) {
        data.age = new Date().getFullYear() - birthDate.getFullYear();
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    return { user: publicUser(user) };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException("Not found");

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash
    );

    if (!isMatch) {
      throw new BadRequestException("Sai mật khẩu hiện tại");
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException("Mật khẩu mới không được trùng");
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { ok: true };
  }
 

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: { addresses: true },
    });

    return users.map((user) => publicUser(user));
  }


  async listAddresses(userId: string) {
    const addresses = await this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return { addresses };
  }

  async createAddress(userId: string, dto: AddressDto) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const address = await this.prisma.address.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        fullAddress: dto.fullAddress,
        userId,
        isDefault: dto.isDefault ?? false,
      },
    });

    return { address };
  }

  async updateAddress(
    userId: string,
    addressId: string,
    dto: Partial<AddressDto>
  ) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) throw new NotFoundException("Not found");

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const data: any = {
      name: dto.name,
      phone: dto.phone,
      fullAddress: dto.fullAddress,
      isDefault: dto.isDefault,
    };

    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key]
    );

    const address = await this.prisma.address.update({
      where: { id: addressId },
      data,
    });

    return { address };
  }

  async getAddressById(userId: string, addressId: string) {
    if (!addressId) {
      throw new BadRequestException("Address ID không được để trống");
    }

    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId.trim(),
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException("Không tìm thấy địa chỉ");
    }

    return address;
  }

  async deleteAddress(userId: string, addressId: string) {
    const existing = await this.prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) throw new NotFoundException("Not found");

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { ok: true };
  }
}
