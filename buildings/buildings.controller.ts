import { Controller, Get, Post, Body } from '@nestjs/common';
import { BuildingsService } from './buildings.service';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  create(@Body() body: any) {
    return this.buildingsService.create(body);
  }

  @Get()
  findAll() {
    return this.buildingsService.findAll();
  }
}
