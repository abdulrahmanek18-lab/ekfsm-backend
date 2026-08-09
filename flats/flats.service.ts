import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.flat.create({
      data: {
        unitNumber: data.unitNumber,
        floor: data.floor ? parseInt(data.floor) : null,
        type: data.type || null,
        buildingId: data.buildingId,
      },
    });
  }

  async findAll() {
    return this.prisma.flat.findMany({
      include: { building: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
