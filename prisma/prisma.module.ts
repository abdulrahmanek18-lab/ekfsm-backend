import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule
 * ------------
 * Global module that provides the PrismaService singleton.
 * Marked as @Global() so PrismaService can be injected
 * into any module without explicitly importing PrismaModule.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
