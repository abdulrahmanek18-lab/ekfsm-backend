import { Module } from '@nestjs/common';
import { ReceiptsController } from './receipts.controller';
import { ReceiptsService } from './receipts.service';

@Module({
  controllers: [ReceiptsController], // <-- The controller goes inside the brackets!
  providers: [ReceiptsService],
})
export class ReceiptsModule {}
