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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
function publicUser(user) {
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
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException("Không tìm thấy người dùng");
        }
        await this.prisma.user.delete({
            where: { id },
        });
        return {
            message: "Xóa người dùng thành công",
            ok: true,
        };
    }
    async me(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                addresses: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException("Not found");
        return {
            user: publicUser(user),
            addresses: user.addresses,
        };
    }
    async getById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
        }
        return {
            user: publicUser(user),
            addresses: user.addresses,
        };
    }
    async update(userId, dto) {
        const data = {
            email: dto.email,
            userName: dto.userName,
            fullName: dto.fullName,
            phone: dto.phone,
            gender: dto.gender,
            birthday: dto.birthday,
            avatar: dto.avatar,
        };
        Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
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
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            throw new common_1.NotFoundException("Not found");
        const isMatch = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.BadRequestException("Sai mật khẩu hiện tại");
        }
        if (dto.currentPassword === dto.newPassword) {
            throw new common_1.BadRequestException("Mật khẩu mới không được trùng");
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
    async listAddresses(userId) {
        const addresses = await this.prisma.address.findMany({
            where: { userId },
            orderBy: [
                { isDefault: "desc" },
                { createdAt: "desc" },
            ],
        });
        return { addresses };
    }
    async createAddress(userId, dto) {
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
    async updateAddress(userId, addressId, dto) {
        const existing = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!existing)
            throw new common_1.NotFoundException("Not found");
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        const data = {
            name: dto.name,
            phone: dto.phone,
            fullAddress: dto.fullAddress,
            isDefault: dto.isDefault,
        };
        Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);
        const address = await this.prisma.address.update({
            where: { id: addressId },
            data,
        });
        return { address };
    }
    async getAddressById(userId, addressId) {
        if (!addressId) {
            throw new common_1.BadRequestException("Address ID không được để trống");
        }
        const address = await this.prisma.address.findFirst({
            where: {
                id: addressId.trim(),
                userId,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException("Không tìm thấy địa chỉ");
        }
        return address;
    }
    async deleteAddress(userId, addressId) {
        const existing = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });
        if (!existing)
            throw new common_1.NotFoundException("Not found");
        await this.prisma.address.delete({
            where: { id: addressId },
        });
        return { ok: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map