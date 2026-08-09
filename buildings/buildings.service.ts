import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuildingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new Error('No company exists in the database.');
    }

    return this.prisma.building.create({
      data: {
        name: data.name,
        address: data.address || null,
        city: data.city || null,
        emirate: data.emirate || null,
        customerId: data.customerId,
        companyId: company.id, 
      },
    });
  }

  async findAll() {
    // We include the customer so you can see who owns the building
    return this.prisma.building.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
