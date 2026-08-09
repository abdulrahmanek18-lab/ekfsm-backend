import { Controller, Get, Post, Body } from '@nestjs/common';
import { AmcService } from './amc.service';

@Controller('amc')
export class AmcController {
  constructor(private readonly amcService: AmcService) {}

  @Post()
  create(@Body() body: any) {
    return this.amcService.create(body);
  }

  @Get()
  findAll() {
    return this.amcService.findAll();
  }
}
