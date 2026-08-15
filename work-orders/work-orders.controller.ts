import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';
import { Roles } from '../auth/roles.decorator';

@Controller('work-orders')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COORDINATOR', 'TECHNICIAN')
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

  // NEW: Route for inline status dropdown
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.service.updateStatus(id, body.status);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }
}
