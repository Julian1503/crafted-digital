// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
        roles: string[];
        active: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        roles: string[];
        active: boolean;
    }
}