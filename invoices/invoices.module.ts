import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesExtraService } from './invoices-extra.service';
import { InvoicesController } from './invoices.controller';

@Module({
  providers: [InvoicesService, InvoicesExtraService],
  controllers: [InvoicesController],
  exports: [InvoicesService, InvoicesExtraService],
})
export class InvoicesModule {}
