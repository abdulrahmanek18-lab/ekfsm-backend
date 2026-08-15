import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    const year = new Date().getFullYear();
    const count = await this.prisma.paymentVoucher.count({ where: { voucherNumber: { startsWith: `PV-${year}-` } } });
    const voucherNumber = `PV-${year}-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.paymentVoucher.create({
      data: {
        voucherNumber,
        date: data.date ? new Date(data.date) : new Date(),
        payeeName: data.payeeName,
        purchaseId: data.purchaseId || null,
        amount: parseFloat(data.amount) || 0,
        paymentMode: data.paymentMode || 'CASH',
        chequeNumber: data.chequeNumber || null,
        bankName: data.bankName || null,
        chequeDate: data.chequeDate ? new Date(data.chequeDate) : null,
        chequeStatus: data.chequeStatus || null,
        description: data.description || null,
        companyId: company.id,
      },
    });
  }

  async findAll() {
    return this.prisma.paymentVoucher.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
