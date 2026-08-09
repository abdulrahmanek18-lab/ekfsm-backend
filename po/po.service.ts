import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    return this.prisma.purchaseOrder.create({
      data: {
        poNumber: data.poNumber,
        supplierName: data.supplierName,
        supplierPhone: data.supplierPhone || null,
        // The frontend sends subtotal, vatAmount, and total. We parse them to floats to be safe.
        subtotal: parseFloat(data.subtotal), 
        vatAmount: parseFloat(data.vatAmount),
        total: parseFloat(data.total),
        companyId: company.id,
        status: 'DRAFT', // Default status
      },
    });
  }

  async findAll() {
    return this.prisma.purchaseOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
