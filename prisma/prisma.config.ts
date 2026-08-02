import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Prisma Client Configuration
 * ---------------------------
 * Centralized configuration for the PrismaClient instance.
 * Provides logging levels, connection settings, query middleware,
 * and extension hooks for the ekFSM ERP backend.
 */

export interface PrismaConfigOptions {
  /** Database connection string */
  databaseUrl: string;
  /** Enable query logging */
  logQueries?: boolean;
  /** Enable query performance warnings (ms threshold) */
  slowQueryThreshold?: number;
  /** Maximum number of connections in the pool */
  connectionLimit?: number;
  /** Enable extended error formatting */
  extendedErrors?: boolean;
}

/**
 * Default configuration values
 */
export const defaultPrismaConfig: Omit<PrismaConfigOptions, 'databaseUrl'> = {
  logQueries: process.env.NODE_ENV !== 'production',
  slowQueryThreshold: 1000, // 1 second
  connectionLimit: 10,
  extendedErrors: process.env.NODE_ENV !== 'production',
};

/**
 * Build PrismaClient log configuration based on environment
 */
export function getPrismaLogLevels(): Prisma.LogLevel[] {
  const env = process.env.NODE_ENV || 'development';

  if (env === 'production') {
    return ['error', 'warn'];
  }

  if (env === 'test') {
    return ['error', 'warn', 'info'];
  }

  // Development: verbose logging
  return ['query', 'info', 'warn', 'error'];
}

/**
 * Build PrismaClient constructor options
 */
export function buildPrismaClientOptions(
  config: PrismaConfigOptions,
): Prisma.PrismaClientOptions {
  const logLevels = getPrismaLogLevels();

  const logConfig: Prisma.LogDefinition[] = logLevels.map((level) => ({
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
    // Connection pool configuration
    // Note: connection_limit is configured via URL query param or directly in schema
  };
}

/**
 * Create a configured PrismaClient instance with middleware
 */
export function createPrismaClient(config?: Partial<PrismaConfigOptions>): PrismaClient {
  const configService = new ConfigService();

  const mergedConfig: PrismaConfigOptions = {
    databaseUrl: config?.databaseUrl || configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL || '',
    ...defaultPrismaConfig,
    ...config,
  };

  if (!mergedConfig.databaseUrl) {
    throw new Error(
      '[PrismaConfig] DATABASE_URL is not defined. Please set it in your environment variables.',
    );
  }

  const options = buildPrismaClientOptions(mergedConfig);
  const client = new PrismaClient(options);

  // ── Query Performance Middleware ──
  if (mergedConfig.logQueries || mergedConfig.slowQueryThreshold) {
    client.$use(async (params, next) => {
      const start = performance.now();
      const result = await next(params);
      const duration = performance.now() - start;

      // Log slow queries
      if (
        mergedConfig.slowQueryThreshold &&
        duration > mergedConfig.slowQueryThreshold
      ) {
        console.warn(
          `[Prisma Slow Query] ${params.model}.${params.action} took ${duration.toFixed(2)}ms`,
          {
            model: params.model,
            action: params.action,
            args: params.args,
            duration: `${duration.toFixed(2)}ms`,
            threshold: `${mergedConfig.slowQueryThreshold}ms`,
          },
        );
      }

      // Log all queries in development
      if (mergedConfig.logQueries && process.env.NODE_ENV === 'development') {
        console.log(
          `[Prisma Query] ${params.model}.${params.action} — ${duration.toFixed(2)}ms`,
        );
      }

      return result;
    });
  }

  // ── Audit/Soft-Delete Middleware Hook (prepared for future use) ──
  // Uncomment and extend when implementing soft deletes or audit trails
  /*
  client.$use(async (params, next) => {
    // Example: Auto-set companyId on create if context available
    if (params.action === 'create' && params.args?.data) {
      // Add audit fields here
    }
    return next(params);
  });
  */

  return client;
}

/**
 * Prisma Client extension for ekFSM-specific utilities
 * Provides helper methods for common ERP operations.
 */
export function createExtendedPrismaClient(config?: Partial<PrismaConfigOptions>) {
  const client = createPrismaClient(config);

  return client.$extends({
    model: {
      // Extend models with custom methods if needed
      // Example: workOrder: { ... }
    },
    query: {
      // Global query extensions
      // Example: auto-filter by company_id for multi-tenant scenarios
    },
    result: {
      // Computed fields
      // Example: invoice: { totalWithVat: { ... } }
    },
  });
}

/**
 * Singleton PrismaClient instance for non-NestJS contexts
 * (e.g., seed scripts, standalone scripts, CLI tools)
 */
let globalPrisma: PrismaClient | undefined;

export function getGlobalPrismaClient(): PrismaClient {
  if (!globalPrisma) {
    globalPrisma = createPrismaClient();
  }
  return globalPrisma;
}

export async function disconnectGlobalPrisma(): Promise<void> {
  if (globalPrisma) {
    await globalPrisma.$disconnect();
    globalPrisma = undefined;
  }
}

/**
 * Health check utility for database connectivity
 */
export async function checkDatabaseHealth(
  client: PrismaClient,
): Promise<{ status: 'ok' | 'error'; latencyMs: number; message?: string }> {
  const start = performance.now();
  try {
    await client.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      latencyMs: Math.round(performance.now() - start),
    };
  } catch (error) {
    return {
      status: 'error',
      latencyMs: Math.round(performance.now() - start),
      message: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}
