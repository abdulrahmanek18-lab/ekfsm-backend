import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.serviceCategory.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
    });
  }

  async findAll() {
    return this.prisma.serviceCategory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
