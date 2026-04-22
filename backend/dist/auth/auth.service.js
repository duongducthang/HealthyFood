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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
function publicUser(u) {
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
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const email = dto.email.toLowerCase();
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing)
            throw new common_1.ConflictException("Email already registered");
        const passwordHash = await bcrypt.hash(dto.password, 10);
        let age = null;
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
    async login(dto) {
        const email = dto.email.toLowerCase();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không chính xác!");
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException("Email hoặc mật khẩu không chính xác!");
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
    async refresh(refreshToken) {
        try {
            const payload = this.jwt.verify(refreshToken);
            return {
                access_token: this.jwt.sign({
                    userId: payload.userId,
                    email: payload.email,
                }, { expiresIn: "15m" }),
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException("Invalid refresh token");
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map