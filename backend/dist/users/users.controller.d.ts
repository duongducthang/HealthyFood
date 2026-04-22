import { UsersService } from "./users.service";
import { UpdateMeDto } from "./dto/update-me.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AddressDto } from "./dto/address.dto";
export declare class UsersController {
    private readonly users;
    [x: string]: any;
    constructor(users: UsersService);
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
    me(req: any): Promise<{
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
    create(createUserDto: any): Promise<{
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
    updateMe(req: any, dto: UpdateMeDto): Promise<{
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
    updateById(id: string, dto: UpdateMeDto): Promise<{
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
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        ok: boolean;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
        ok: boolean;
    }>;
    listAddresses(req: any): Promise<{
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
    getAddressById(req: any, id: string): Promise<import("@prisma/client/runtime").GetResult<{
        id: string;
        userId: string;
        name: string;
        phone: string;
        fullAddress: string;
        isDefault: boolean;
        createdAt: Date;
    }, unknown> & {}>;
    createAddress(req: any, dto: AddressDto): Promise<{
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
    updateAddress(req: any, id: string, dto: Partial<AddressDto>): Promise<{
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
    deleteAddress(req: any, id: string): Promise<{
        ok: boolean;
    }>;
}
