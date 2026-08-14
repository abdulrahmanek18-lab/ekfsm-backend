import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    // Use standard Prisma create instead of raw SQL
    return this.prisma.purchase.create({
      data: {
        supplierName: data.supplierName,
        billNumber: data.billNumber,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        workOrderId: data.workOrderId || null,
        assetId: data.assetId || null,
        items: data.items || [],
        subtotal: parseFloat(data.subtotal) || 0,
        vatAmount: parseFloat(data.vatAmount) || 0,
        totalAmount: parseFloat(data.totalAmount) || 0,
        paymentStatus: data.paymentStatus || 'UNPAID',
        paymentMethod: data.paymentMethod || 'CASH',
        receiptUrl: data.receiptUrl || null,
        companyId: company.id,
      },
    });
  }

  async findAll() {
    return this.prisma.purchase.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
