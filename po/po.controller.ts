import { Controller, Get, Post, Body } from '@nestjs/common';
import { PoService } from './po.service';
import { Roles } from '../auth/roles.decorator';

@Controller('po')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT')
export class PoController {
  constructor(private readonly poService: PoService) {}

  @Post()
  create(@Body() body: any) {
    return this.poService.create(body);
  }

  @Get()
  findAll() {
    return this.poService.findAll();
  }
}
