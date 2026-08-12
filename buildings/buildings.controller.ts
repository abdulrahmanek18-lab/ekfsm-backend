import { Controller, Get, Post, Body } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { Roles } from '../auth/roles.decorator';

@Controller('buildings')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COORDINATOR')
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
