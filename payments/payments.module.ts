import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  controllers: [PaymentsController], // <-- The controller goes inside the brackets!
  providers: [PaymentsService],
})
export class PaymentsModule {}
