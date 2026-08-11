import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('dashboard')
  @Roles('ADMIN', 'SUPERVISOR', 'COORDINATOR')
  dashboard(@Request() req) {
    return this.service.getDashboardKPIs(req.user.companyId);
  }

  @Get('jobs')
  @Roles('ADMIN', 'SUPERVISOR')
  jobReport(@Request() req, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getJobReport(req.user.companyId, startDate, endDate);
  }

  @Get('technicians')
  @Roles('ADMIN', 'SUPERVISOR')
  technicianPerformance(@Request() req, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.getTechnicianPerformance(req.user.companyId, startDate, endDate);
  }
}
