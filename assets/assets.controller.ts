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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // NEW: Route for QR Scanner
  @Get('scan/:assetNumber')
  findByAssetNumber(@Param('assetNumber') assetNumber: string) {
    return this.service.findByAssetNumber(assetNumber);
  }
}
