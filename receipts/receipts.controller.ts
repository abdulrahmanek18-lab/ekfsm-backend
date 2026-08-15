import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { Roles } from '../auth/roles.decorator';

@Controller('receipts')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT')
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
