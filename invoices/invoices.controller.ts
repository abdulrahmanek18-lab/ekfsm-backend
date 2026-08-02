import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly service: InvoicesService) {}

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

  @Post(':id/payments')
  addPayment(@Param('id') id: string, @Body() dto: any) { return this.service.addPayment(id, dto.companyId, dto); }

  @Get('reports/vat')
  vatReport(@Query() query: any) { return this.service.getVatReport(query.companyId, query.from, query.to); }
}
