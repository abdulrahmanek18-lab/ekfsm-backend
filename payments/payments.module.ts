import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';

@Module({
  controllers: [ReceiptsController], // <--- IF THIS IS MISSING, IT WON'T WORK
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
