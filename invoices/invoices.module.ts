import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesExtraService } from './invoices-extra.service'; // <-- Import it

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, InvoicesExtraService], // <-- Add it here
})
export class InvoicesModule {}
