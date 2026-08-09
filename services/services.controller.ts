import { Controller, Get, Post, Body } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() body: any) {
    return this.servicesService.create(body);
  }

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }
}
