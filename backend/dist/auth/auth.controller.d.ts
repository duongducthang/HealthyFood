import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
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
    profile(req: any): Promise<{
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
    logout(): {
        message: string;
    };
    refresh(body: any): Promise<{
        access_token: string;
    }>;
}
