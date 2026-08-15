import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController], // MUST BE HERE
  providers: [PaymentsService],
})
export class PaymentsModule {}
