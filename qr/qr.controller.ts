import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { QrService } from './qr.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('qr')
@UseGuards(JwtAuthGuard)
export class QrController {
  constructor(private readonly service: QrService) {}

  @Get('asset/:assetId')
  generateAssetQr(@Param('assetId') assetId: string) {
    return this.service.generateAssetQr(assetId);
  }

  @Get('flat/:flatId')
  generateFlatQr(@Param('flatId') flatId: string) {
    return this.service.generateFlatQr(flatId);
  }

  @Post('scan')
  scan(@Body('qrData') qrData: string) {
    return this.service.scanAndLookup(qrData);
  }

  @Post('bulk/building/:buildingId')
  @Roles('ADMIN', 'COORDINATOR')
  bulkGenerate(@Param('buildingId') buildingId: string) {
    return this.service.bulkGenerateForBuilding(buildingId);
  }
}
