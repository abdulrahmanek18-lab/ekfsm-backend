import { Module } from '@nestjs/common';
import { AmcService } from './amc.service';
import { AmcController } from './amc.controller';

@Module({
  providers: [AmcService],
  controllers: [AmcController],
  exports: [AmcService],
})
export class AmcModule {}
