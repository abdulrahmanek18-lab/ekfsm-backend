import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  private defaultSettings = {
    systemName: 'MAK INFRATECH FMS',
    language: 'en',
    timezone: 'Asia/Dubai',
    currency: 'AED',
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    lowStockThreshold: 5,
  };

  getSettings() {
    return this.defaultSettings;
  }

  updateSettings(data: any) {
    // In the future, you can save this to the database.
    // For now, it just updates the in-memory object.
    this.defaultSettings = { ...this.defaultSettings, ...data };
    return this.defaultSettings;
  }
}