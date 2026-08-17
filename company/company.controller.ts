import { Controller, Get, Post, Body } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('api/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompany() {
    return this.companyService.getCompany();
  }

  @Post()
  async saveCompany(@Body() body: any) {
    return this.companyService.saveCompany(body);
  }
}
