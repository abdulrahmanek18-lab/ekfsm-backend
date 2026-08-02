import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            companyId: string;
        };
    }>;
    refresh(dto: {
        token: string;
    }): Promise<{
        access_token: string;
    }>;
}
