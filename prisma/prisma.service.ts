import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import {
  createPrismaClient,
  checkDatabaseHealth,
  PrismaConfigOptions,
} from './prisma.config';

/**
 * PrismaService
 * -------------
 * NestJS-managed PrismaClient wrapper.
 * Provides lifecycle hooks, health checks, and clean shutdown.
 * Exported globally via PrismaModule so all modules can inject it.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const prismaConfig: PrismaConfigOptions = {
      databaseUrl: configService.get<string>('DATABASE_URL'),
      logQueries: configService.get<string>('NODE_ENV') !== 'production',
      slowQueryThreshold: configService.get<number>('SLOW_QUERY_THRESHOLD') || 1000,
      extendedErrors: configService.get<string>('NODE_ENV') !== 'production',
    };

    // Initialize PrismaClient via the config factory
    const client = createPrismaClient(prismaConfig);

    // We need to "become" the created client. Since PrismaClient is a class,
    // we call super with empty options and then copy the internal engine.
    // However, the cleaner NestJS pattern is to pass options to super directly.
    super({
      datasources: {
        db: { url: prismaConfig.databaseUrl },
      },
      log: [
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
        ...(prismaConfig.logQueries
          ? [
              { emit: 'stdout', level: 'info' } as const,
              { emit: 'stdout', level: 'query' } as const,
            ]
          : []),
      ],
      errorFormat: prismaConfig.extendedErrors ? 'pretty' : 'minimal',
    });

    // Attach slow-query middleware if threshold is set
    if (prismaConfig.slowQueryThreshold) {
      this.$use(async (params, next) => {
        const start = performance.now();
        const result = await next(params);
        const duration = performance.now() - start;

        if (duration > prismaConfig.slowQueryThreshold!) {
          this.logger.warn(
            `Slow query detected: ${params.model}.${params.action} took ${duration.toFixed(2)}ms`,
            {
              model: params.model,
              action: params.action,
              duration: `${duration.toFixed(2)}ms`,
              threshold: `${prismaConfig.slowQueryThreshold}ms`,
            },
          );
        }
        return result;
      });
    }
  }

  /**
   * Connect to the database when the module initializes.
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('PrismaClient connected to database successfully.');
    } catch (error) {
      this.logger.error(
        'Failed to connect PrismaClient to database',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

  /**
   * Disconnect cleanly when the module shuts down.
   * Handles graceful shutdown on SIGTERM / SIGINT.
   */
  async onModuleDestroy(): Promise<void> {
    try {
      await this.$disconnect();
      this.logger.log('PrismaClient disconnected cleanly.');
    } catch (error) {
      this.logger.error(
        'Error during PrismaClient disconnect',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Perform a lightweight health check (SELECT 1).
   * Returns latency and status for readiness probes.
   */
  async healthCheck(): Promise<{
    status: 'ok' | 'error';
    latencyMs: number;
    message?: string;
  }> {
    return checkDatabaseHealth(this);
  }

  /**
   * Clean helper to run operations inside a transaction.
   * Wraps Prisma's $transaction with logging.
   */
  async executeTransaction<T>(
    operations: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>,
    options?: { isolationLevel?: 'ReadUncommitted' | 'ReadCommitted' | 'RepeatableRead' | 'Serializable'; maxWait?: number; timeout?: number },
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await this.$transaction(operations, options);
      const duration = performance.now() - start;
      this.logger.debug(`Transaction completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.logger.error(
        `Transaction failed after ${duration.toFixed(2)}ms`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  /**
   * Enable query logging at runtime (useful for debugging).
   */
  enableQueryLogging(): void {
    this.$on('query' as never, (e: any) => {
      this.logger.debug(`Query: ${e.query} — Params: ${e.params} — ${e.duration}ms`);
    });
  }
}
