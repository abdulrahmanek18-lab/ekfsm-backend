import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReceiptsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    const year = new Date().getFullYear();
    const count = await this.prisma.receiptVoucher.count({ where: { voucherNumber: { startsWith: `RV-${year}-` } } });
    const voucherNumber = `RV-${year}-${String(count + 1).padStart(4, '0')}`;

    const receipt = await this.prisma.receiptVoucher.create({
      data: {
        voucherNumber,
        date: data.date ? new Date(data.date) : new Date(),
        customerId: data.customerId || null,
        invoiceId: data.invoiceId || null,
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

    // AUTO-RECONCILIATION: Update Invoice status
    if (data.invoiceId) {
      const invoice = await this.prisma.invoice.findUnique({ where: { id: data.invoiceId } });
      if (invoice) {
        const newAmountPaid = (invoice.amountPaid || 0) + parseFloat(data.amount);
        const balanceDue = invoice.total - newAmountPaid;
        
        await this.prisma.invoice.update({
          where: { id: data.invoiceId },
          data: {
            amountPaid: newAmountPaid,
            balanceDue: balanceDue > 0 ? balanceDue : 0,
            status: balanceDue <= 0 ? 'PAID' : 'PARTIAL',
          },
        });
      }
    }

    return receipt;
  }

  async findAll() {
    return this.prisma.receiptVoucher.findMany({
      include: { customer: true, invoice: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
