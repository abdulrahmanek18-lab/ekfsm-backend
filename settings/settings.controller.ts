import { Controller, Get, Post, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
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