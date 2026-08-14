import { Controller, Get, Post, Body } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Roles } from '../auth/roles.decorator';

@Controller('purchases')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT')
export class PurchasesController {
  constructor(private readonly service: PurchasesService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
