import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }
}
