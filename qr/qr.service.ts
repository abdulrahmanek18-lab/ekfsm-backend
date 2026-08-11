import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  constructor(private prisma: PrismaService) {}

  async generateAssetQr(assetId: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new Error('Asset not found');
    const data = JSON.stringify({ type: 'ASSET', id: asset.id, number: asset.assetNumber });
    const qrDataUrl = await QRCode.toDataURL(data, { width: 400, margin: 2 });
    
    // Removed database update because Prisma schema doesn't have qrCode column
    return { qrCode: qrDataUrl, asset };
  }

  async generateFlatQr(flatId: string) {
    const flat = await this.prisma.flat.findUnique({
      where: { id: flatId },
      include: { building: true },
    });
    if (!flat) throw new Error('Flat not found');
    
    // Changed flat.number to flat.unitNumber based on your Prisma schema
    const data = JSON.stringify({ type: 'FLAT', id: flat.id, number: flat.unitNumber, building: flat.building.name });
    const qrDataUrl = await QRCode.toDataURL(data, { width: 400, margin: 2 });
    return { qrCode: qrDataUrl, flat };
  }

  async scanAndLookup(qrData: string) {
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.type === 'ASSET') {
        const asset = await this.prisma.asset.findUnique({
          where: { id: parsed.id },
          include: { flat: { include: { building: true } }, amcs: true, workOrders: { orderBy: { createdAt: 'desc' }, take: 5 } },
        });
        return { type: 'ASSET', data: asset };
      }
      if (parsed.type === 'FLAT') {
        const flat = await this.prisma.flat.findUnique({
          where: { id: parsed.id },
          include: { building: true, assets: { include: { amcs: true } } },
        });
        return { type: 'FLAT', data: flat };
      }
      return { type: 'UNKNOWN', data: null };
    } catch {
      return { type: 'UNKNOWN', data: null };
    }
  }

  async bulkGenerateForBuilding(buildingId: string) {
    const flats = await this.prisma.flat.findMany({
      where: { buildingId },
      include: { assets: true },
    });
    const results = [];
    for (const flat of flats) {
      for (const asset of flat.assets) {
        const result = await this.generateAssetQr(asset.id);
        results.push(result);
      }
    }
    return results;
  }
}
