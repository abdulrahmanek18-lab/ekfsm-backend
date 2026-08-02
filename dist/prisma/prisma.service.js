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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const prisma_config_1 = require("./prisma.config");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor(configService) {
        const prismaConfig = {
            databaseUrl: configService.get('DATABASE_URL'),
            logQueries: configService.get('NODE_ENV') !== 'production',
            slowQueryThreshold: configService.get('SLOW_QUERY_THRESHOLD') || 1000,
            extendedErrors: configService.get('NODE_ENV') !== 'production',
        };
        const client = (0, prisma_config_1.createPrismaClient)(prismaConfig);
        super({
            datasources: {
                db: { url: prismaConfig.databaseUrl },
            },
            log: [
                { emit: 'stdout', level: 'warn' },
                { emit: 'stdout', level: 'error' },
                ...(prismaConfig.logQueries
                    ? [
                        { emit: 'stdout', level: 'info' },
                        { emit: 'stdout', level: 'query' },
                    ]
                    : []),
            ],
            errorFormat: prismaConfig.extendedErrors ? 'pretty' : 'minimal',
        });
        this.configService = configService;
        this.logger = new common_1.Logger(PrismaService_1.name);
        if (prismaConfig.slowQueryThreshold) {
            this.$use(async (params, next) => {
                const start = performance.now();
                const result = await next(params);
                const duration = performance.now() - start;
                if (duration > prismaConfig.slowQueryThreshold) {
                    this.logger.warn(`Slow query detected: ${params.model}.${params.action} took ${duration.toFixed(2)}ms`, {
                        model: params.model,
                        action: params.action,
                        duration: `${duration.toFixed(2)}ms`,
                        threshold: `${prismaConfig.slowQueryThreshold}ms`,
                    });
                }
                return result;
            });
        }
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('PrismaClient connected to database successfully.');
        }
        catch (error) {
            this.logger.error('Failed to connect PrismaClient to database', error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('PrismaClient disconnected cleanly.');
        }
        catch (error) {
            this.logger.error('Error during PrismaClient disconnect', error instanceof Error ? error.message : String(error));
        }
    }
    async healthCheck() {
        return (0, prisma_config_1.checkDatabaseHealth)(this);
    }
    async executeTransaction(operations, options) {
        const start = performance.now();
        try {
            const result = await this.$transaction(operations, options);
            const duration = performance.now() - start;
            this.logger.debug(`Transaction completed in ${duration.toFixed(2)}ms`);
            return result;
        }
        catch (error) {
            const duration = performance.now() - start;
            this.logger.error(`Transaction failed after ${duration.toFixed(2)}ms`, error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
    enableQueryLogging() {
        this.$on('query', (e) => {
            this.logger.debug(`Query: ${e.query} — Params: ${e.params} — ${e.duration}ms`);
        });
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map