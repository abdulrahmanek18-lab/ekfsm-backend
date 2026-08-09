import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
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

  // Technicians use this route to fetch history by scanning QR / entering asset number
  @Get(':assetNumber/history')
  getHistory(@Param('assetNumber') assetNumber: string) {
    return this.service.getHistory(assetNumber);
  }

  // Technicians use this route to add a new service record after scanning
  @Post(':assetNumber/history')
  addHistory(@Param('assetNumber') assetNumber: string, @Body() body: any) {
    return this.service.addHistory(assetNumber, body);
  }
}
