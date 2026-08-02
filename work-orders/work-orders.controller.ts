import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';

@Controller('work-orders')
export class WorkOrdersController {
  constructor(private readonly service: WorkOrdersService) {}

  @Post()
  create(@Body() dto: any) { return this.service.create(dto); }

  @Get()
  findAll(@Query() query: any) { return this.service.findAll(query.companyId, query); }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('companyId') companyId: string) { return this.service.findOne(id, companyId); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto.companyId, dto); }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('companyId') companyId: string) { return this.service.remove(id, companyId); }
}
