import { Controller, Get, Post, Body } from '@nestjs/common';
import { StaffService } from './staff.service';
import { Roles } from '../auth/roles.decorator';

@Controller('staff')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
export class StaffController {
  constructor(private readonly service: StaffService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
