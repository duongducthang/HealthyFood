import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        refresh_token: string;
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
    login(dto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
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
    refresh(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
