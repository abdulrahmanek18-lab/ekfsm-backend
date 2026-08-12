import { Controller, Get, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Roles } from '../auth/roles.decorator';

@Controller('settings')
@Roles('SUPER_ADMIN', 'ADMIN') // <--- ADD THIS: Only Admins can change settings
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  getSettings() {
    return this.service.getSettings();
  }

  @Post()
  updateSettings(@Body() body: any) {
    return this.service.updateSettings(body);
  }
}
