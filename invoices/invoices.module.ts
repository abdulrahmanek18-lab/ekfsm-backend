import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesExtraService } from './invoices-extra.service'; // <-- Exact filename here

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesExtraService], // <-- Registered here
})
export class InvoicesModule {}
