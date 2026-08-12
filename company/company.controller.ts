import { Controller, Get, Post, Body } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Roles } from '../auth/roles.decorator';

@Controller('company')
@Roles('SUPER_ADMIN', 'ADMIN')
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
