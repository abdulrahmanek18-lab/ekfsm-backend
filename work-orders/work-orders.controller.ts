import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';
import { Roles } from '../auth/roles.decorator';

@Controller('work-orders')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COORDINATOR', 'TECHNICIAN') // <--- ADD THIS
export class WorkOrdersController {
  constructor(private readonly service: WorkOrdersService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }
}
