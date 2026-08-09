import { Controller, Get, Post, Body } from '@nestjs/common';
import { FlatsService } from './flats.service';

@Controller('flats')
export class FlatsController {
  constructor(private readonly flatsService: FlatsService) {}

  @Post()
  create(@Body() body: any) {
    return this.flatsService.create(body);
  }

  @Get()
  findAll() {
    return this.flatsService.findAll();
  }
}
