import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Roles } from '../auth/roles.decorator';

@Controller('assets')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COORDINATOR', 'TECHNICIAN')
export class AssetsController {
  constructor(private readonly service: AssetsService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':assetNumber/history')
  getHistory(@Param('assetNumber') assetNumber: string) {
    return this.service.getHistory(assetNumber);
  }

  @Post(':assetNumber/history')
  addHistory(@Param('assetNumber') assetNumber: string, @Body() body: any) {
    return this.service.addHistory(assetNumber, body);
  }
}
