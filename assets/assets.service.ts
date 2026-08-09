import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    // Auto-generate Asset Number (e.g., AST-0001)
    const count = await this.prisma.asset.count();
    const assetNumber = `AST-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.asset.create({
      data: {
        assetNumber,
        name: data.name, // e.g., "Split AC 2 Ton"
        location: data.location, // e.g., "Master Bedroom"
        manufacturer: data.manufacturer || null,
        model: data.model || null,
        serialNumber: data.serialNumber || null,
        companyId: company.id,
      },
    });
  }

  async findAll() {
    return this.prisma.asset.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Fetch asset details + all past service history
  async getHistory(assetNumber: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { assetNumber },
      include: { 
        serviceHistory: { 
          orderBy: { performedAt: 'desc' } 
        } 
      },
    });

    if (!asset) throw new Error('Asset not found with that number');
    return asset;
  }

  // Add a new service record to the asset's history
  async addHistory(assetNumber: string, data: any) {
    const asset = await this.prisma.asset.findFirst({
      where: { assetNumber },
    });

    if (!asset) throw new Error('Asset not found with that number');

    return this.prisma.assetServiceHistory.create({
      data: {
        assetId: asset.id,
        action: data.action || 'Service',
        description: data.description || null,
        performedBy: data.performedBy || 'Technician',
      },
    });
  }
}
