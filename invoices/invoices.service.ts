import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    const subtotal = parseFloat(data.subtotal);
    const vatRate = 5; // UAE VAT 5%
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    // 1. Create the Invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`, // Auto-generate a unique invoice number
        customerId: data.customerId,
        companyId: company.id,
        issueDate: new Date(),
        dueDate: new Date(data.dueDate),
        subtotal: subtotal,
        vatRate: vatRate,
        vatAmount: vatAmount,
        total: total,
        balanceDue: total, 
        status: data.status || 'DRAFT',
        notes: data.notes || null,
      },
    });

    // 2. If this invoice is for an AMC EMI, link the EMI to this Invoice ID
    if (data.emiId) {
      try {
        await this.prisma.eMISchedule.update({
          where: { id: data.emiId },
          data: { invoiceId: invoice.id },
        });
      } catch (e) {
        console.error("Failed to link EMI, but invoice was saved.");
      }
    }

    return invoice;
  }

  async findAll() {
    // This retrieves all invoices and includes the customer name so you can see it in the table!
    return this.prisma.invoice.findMany({
      include: { customer: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
