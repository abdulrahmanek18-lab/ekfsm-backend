import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AmcService } from './amc.service';

@Controller('amc')
export class AmcController {
  constructor(private readonly service: AmcService) {}

  @Post()
  create(@Body() dto: any) { return this.service.create(dto); }

  @Get()
  findAll(@Query('companyId') companyId: string) { return this.service.findAll(companyId); }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('companyId') companyId: string) { return this.service.findOne(id, companyId); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto.companyId, dto); }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('companyId') companyId: string) { return this.service.remove(id, companyId); }
}
