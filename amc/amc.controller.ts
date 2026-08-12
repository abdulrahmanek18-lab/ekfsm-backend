import { Controller, Get, Post, Body } from '@nestjs/common';
import { AmcService } from './amc.service';
import { Roles } from '../auth/roles.decorator';

@Controller('amc')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT')
export class AmcController {
  constructor(private readonly service: AmcService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
