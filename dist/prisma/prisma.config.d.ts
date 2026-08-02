import { PrismaClient, Prisma } from '@prisma/client';
export interface PrismaConfigOptions {
    databaseUrl: string;
    logQueries?: boolean;
    slowQueryThreshold?: number;
    connectionLimit?: number;
    extendedErrors?: boolean;
}
export declare const defaultPrismaConfig: Omit<PrismaConfigOptions, 'databaseUrl'>;
export declare function getPrismaLogLevels(): Prisma.LogLevel[];
export declare function buildPrismaClientOptions(config: PrismaConfigOptions): Prisma.PrismaClientOptions;
export declare function createPrismaClient(config?: Partial<PrismaConfigOptions>): PrismaClient;
export declare function createExtendedPrismaClient(config?: Partial<PrismaConfigOptions>): import("@prisma/client/runtime/library").DynamicClientExtensionThis<Prisma.TypeMap<import("@prisma/client/runtime/library").InternalArgs & {
    result: {};
    model: {};
    query: {};
    client: {};
}, Prisma.PrismaClientOptions>, Prisma.TypeMapCb, {
    result: {};
    model: {};
    query: {};
    client: {};
}, {}>;
export declare function getGlobalPrismaClient(): PrismaClient;
export declare function disconnectGlobalPrisma(): Promise<void>;
export declare function checkDatabaseHealth(client: PrismaClient): Promise<{
    status: 'ok' | 'error';
    latencyMs: number;
    message?: string;
}>;
