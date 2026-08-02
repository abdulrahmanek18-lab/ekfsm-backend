import { Module } from '@nestjs/common';
import {POService} from './po.service';
import {POController} from './po.controller';

@Module({
  providers: [POService],
  controllers: [POController],
  exports: [POService],
})
export class POModule {}
