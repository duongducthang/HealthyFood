import { PrismaService } from "../prisma/prisma.service";
import { UpdateMeDto } from "./dto/update-me.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AddressDto } from "./dto/address.dto";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: any): Promise<{
        user: {
            id: any;
            email: any;
            userName: any;
            fullName: any;
            phone: any;
            gender: any;
            birthday: any;
            avatar: any;
            age: any;
            createdAt: any;
        };
    }>;
    deleteUser(id: string): Promise<{
        message: string;
        ok: boolean;
    }>;
    me(userId: string): Promise<{
        user: {
            id: any;
            email: any;
            userName: any;
            fullName: any;
            phone: any;
            gender: any;
            birthday: any;
            avatar: any;
            age: any;
            createdAt: any;
        };
        addresses: (import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            name: string;
            phone: string;
            fullAddress: string;
            isDefault: boolean;
            createdAt: Date;
        }, unknown> & {})[];
    }>;
    getById(id: string): Promise<{
        user: {
            id: any;
            email: any;
            userName: any;
            fullName: any;
            phone: any;
            gender: any;
            birthday: any;
            avatar: any;
            age: any;
            createdAt: any;
        };
        addresses: (import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            name: string;
            phone: string;
            fullAddress: string;
            isDefault: boolean;
            createdAt: Date;
        }, unknown> & {})[];
    }>;
    update(userId: string, dto: UpdateMeDto): Promise<{
        user: {
            id: any;
            email: any;
            userName: any;
            fullName: any;
            phone: any;
            gender: any;
            birthday: any;
            avatar: any;
            age: any;
            createdAt: any;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        ok: boolean;
    }>;
    findAll(): Promise<{
        id: any;
        email: any;
        userName: any;
        fullName: any;
        phone: any;
        gender: any;
        birthday: any;
        avatar: any;
        age: any;
        createdAt: any;
    }[]>;
    listAddresses(userId: string): Promise<{
        addresses: (import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            name: string;
            phone: string;
            fullAddress: string;
            isDefault: boolean;
            createdAt: Date;
        }, unknown> & {})[];
    }>;
    createAddress(userId: string, dto: AddressDto): Promise<{
        address: import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            name: string;
            phone: string;
            fullAddress: string;
            isDefault: boolean;
            createdAt: Date;
        }, unknown> & {};
    }>;
    updateAddress(userId: string, addressId: string, dto: Partial<AddressDto>): Promise<{
        address: import("@prisma/client/runtime").GetResult<{
            id: string;
            userId: string;
            name: string;
            phone: string;
            fullAddress: string;
            isDefault: boolean;
            createdAt: Date;
        }, unknown> & {};
    }>;
    getAddressById(userId: string, addressId: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        name: string;
        phone: string;
        fullAddress: string;
        isDefault: boolean;
        createdAt: Date;
    }, unknown> & {}>;
    deleteAddress(userId: string, addressId: string): Promise<{
        ok: boolean;
    }>;
}
