"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPrismaConfig = void 0;
exports.getPrismaLogLevels = getPrismaLogLevels;
exports.buildPrismaClientOptions = buildPrismaClientOptions;
exports.createPrismaClient = createPrismaClient;
exports.createExtendedPrismaClient = createExtendedPrismaClient;
exports.getGlobalPrismaClient = getGlobalPrismaClient;
exports.disconnectGlobalPrisma = disconnectGlobalPrisma;
exports.checkDatabaseHealth = checkDatabaseHealth;
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
exports.defaultPrismaConfig = {
    logQueries: process.env.NODE_ENV !== 'production',
    slowQueryThreshold: 1000,
    connectionLimit: 10,
    extendedErrors: process.env.NODE_ENV !== 'production',
};
function getPrismaLogLevels() {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') {
        return ['error', 'warn'];
    }
    if (env === 'test') {
        return ['error', 'warn', 'info'];
    }
    return ['query', 'info', 'warn', 'error'];
}
function buildPrismaClientOptions(config) {
    const logLevels = getPrismaLogLevels();
    const logConfig = logLevels.map((level) => ({
        emit: level === 'query' ? 'event' : 'stdout',
        level,
    }));
    return {
        datasources: {
            db: {
                url: config.databaseUrl,
            },
        },
        log: logConfig,
        errorFormat: config.extendedErrors ? 'pretty' : 'minimal',
    };
}
function createPrismaClient(config) {
    const configService = new config_1.ConfigService();
    const mergedConfig = {
        databaseUrl: config?.databaseUrl || configService.get('DATABASE_URL') || process.env.DATABASE_URL || '',
        ...exports.defaultPrismaConfig,
        ...config,
    };
    if (!mergedConfig.databaseUrl) {
        throw new Error('[PrismaConfig] DATABASE_URL is not defined. Please set it in your environment variables.');
    }
    const options = buildPrismaClientOptions(mergedConfig);
    const client = new client_1.PrismaClient(options);
    if (mergedConfig.logQueries || mergedConfig.slowQueryThreshold) {
        client.$use(async (params, next) => {
            const start = performance.now();
            const result = await next(params);
            const duration = performance.now() - start;
            if (mergedConfig.slowQueryThreshold &&
                duration > mergedConfig.slowQueryThreshold) {
                console.warn(`[Prisma Slow Query] ${params.model}.${params.action} took ${duration.toFixed(2)}ms`, {
                    model: params.model,
                    action: params.action,
                    args: params.args,
                    duration: `${duration.toFixed(2)}ms`,
                    threshold: `${mergedConfig.slowQueryThreshold}ms`,
                });
            }
            if (mergedConfig.logQueries && process.env.NODE_ENV === 'development') {
                console.log(`[Prisma Query] ${params.model}.${params.action} — ${duration.toFixed(2)}ms`);
            }
            return result;
        });
    }
    return client;
}
function createExtendedPrismaClient(config) {
    const client = createPrismaClient(config);
    return client.$extends({
        model: {},
        query: {},
        result: {},
    });
}
let globalPrisma;
function getGlobalPrismaClient() {
    if (!globalPrisma) {
        globalPrisma = createPrismaClient();
    }
    return globalPrisma;
}
async function disconnectGlobalPrisma() {
    if (globalPrisma) {
        await globalPrisma.$disconnect();
        globalPrisma = undefined;
    }
}
async function checkDatabaseHealth(client) {
    const start = performance.now();
    try {
        await client.$queryRaw `SELECT 1`;
        return {
            status: 'ok',
            latencyMs: Math.round(performance.now() - start),
        };
    }
    catch (error) {
        return {
            status: 'error',
            latencyMs: Math.round(performance.now() - start),
            message: error instanceof Error ? error.message : 'Unknown database error',
        };
    }
}
//# sourceMappingURL=prisma.config.js.map