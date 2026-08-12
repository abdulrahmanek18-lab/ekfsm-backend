import { Controller, Get, Post, Patch, Body, Param, Req } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesExtraService } from './invoices-extra.service';
import { Roles } from '../auth/roles.decorator';

@Controller('invoices')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT', 'CLIENT') // Added CLIENT so they can view their own invoices
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly invoicesExtraService: InvoicesExtraService
  ) {}

  @Post()
  create(@Body() body: any) {
    return this.invoicesService.create(body);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.invoicesService.findAll(req.user); // Pass user to service
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.invoicesService.findOne(id, req.user); // Pass user to service
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: any) {
    return this.invoicesExtraService.updateStatus(id, body.companyId, body.status);
  }

  @Patch(':id/void')
  voidInvoice(@Param('id') id: string, @Body() body: any) {
    return this.invoicesExtraService.voidInvoice(id, body.companyId, body.reason);
  }
}
