import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';

@Module({
  controllers: [ReceiptsController], // MUST BE HERE
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
