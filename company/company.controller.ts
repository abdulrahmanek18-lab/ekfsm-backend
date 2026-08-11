import { Controller, Get, Post, Body } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(private readonly service: CompanyService) {}

  @Get()
  getSettings() {
    return this.service.getSettings();
  }

  @Post()
  updateSettings(@Body() body: any) {
    return this.service.updateSettings(body);
  }
}
