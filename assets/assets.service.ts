import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    const count = await this.prisma.asset.count();
    const assetNumber = `AST-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.asset.create({
      data: {
        assetNumber,
        name: data.name, 
        manufacturer: data.manufacturer || null,
        model: data.model || null,
        serialNumber: data.serialNumber || null,
        location: data.location, 
        // Linking the hierarchy
        buildingId: data.buildingId || null,
        flatId: data.flatId || null,
        // Saving technical details in description
        description: data.description || null,
        companyId: company.id,
      },
    });
  }

  async findAll() {
    // We must include the building and its customer to show in the table
    return this.prisma.asset.findMany({
      include: { 
        building: { include: { customer: true } }, 
        flat: true 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // New detailed view for the modal
  async findOne(id: string) {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        building: { include: { customer: true } },
        flat: true,
        workOrders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  // Find by Asset Number (for QR scanner)
  async findByAssetNumber(assetNumber: string) {
    return this.prisma.asset.findFirst({
      where: { assetNumber },
      include: {
        building: { include: { customer: true } },
        flat: true,
      },
    });
  }
}
