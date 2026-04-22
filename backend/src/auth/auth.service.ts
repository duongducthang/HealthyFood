import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

function publicUser(u: any) {
  return {
    id: u.id,
    email: u.email,
    userName: u.userName,
    fullName: u.fullName,
    phone: u.phone,
    gender: u.gender,
    birthday: u.birthday,
    avatar: u.avatar,
    age: u.age,
    createdAt: u.createdAt,
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  
  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("Email already registered");

    const passwordHash = await bcrypt.hash(dto.password, 10);

    
    let age: number | null = null; 
    if (dto.birthday) {
      const birthYear = parseInt(dto.birthday.split("-")[0]);
      if (!isNaN(birthYear)) {
        age = new Date().getFullYear() - birthYear;
      }
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        userName: dto.userName ?? null,
        fullName: dto.fullName ?? null,
        phone: dto.phone ?? null,
        gender: dto.gender ?? null,
        birthday: dto.birthday ?? null,
        age: age,
      },
    });

  
    if (dto.province || dto.district || dto.address) {
      const fullAddress = [dto.address, dto.district, dto.province]
        .filter(Boolean)
        .join(", ");

      await this.prisma.address.create({
        data: {
          userId: user.id,
          name: user.fullName || user.userName || "Mặc định",
          phone: user.phone || "0000000000",
          fullAddress,
          isDefault: true,
        },
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwt.sign(payload, { expiresIn: "1d" }),
      refresh_token: this.jwt.sign(payload, { expiresIn: "7d" }),
      user: publicUser(user),
    };
  }

  
  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Email hoặc mật khẩu không chính xác!");

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Email hoặc mật khẩu không chính xác!");

    const payload = {
      userId: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwt.sign(payload, { expiresIn: "1d" }),

      refresh_token: this.jwt.sign(payload, { expiresIn: "7d" }),

      user: publicUser(user),
    };
  }

  
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken);

      return {
        access_token: this.jwt.sign(
          {
            userId: payload.userId,
            email: payload.email,
          },
          { expiresIn: "15m" }
        ),
      };
    } catch (err) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}