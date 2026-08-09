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

    // --- NEW INVOICE NUMBER LOGIC (INV-YYYY-00001) ---
    const year = new Date().getFullYear();
    
    // Count how many invoices already exist for this year
    const count = await this.prisma.invoice.count({
      where: { 
        invoiceNumber: { startsWith: `INV-${year}-` } 
      }
    });
    
    // Increment the count by 1 and pad it with zeros so it's 5 digits long (e.g., 00001)
    const sequence = String(count + 1).padStart(5, '0');
    const invoiceNumber = `INV-${year}-${sequence}`; 
    // ---------------------------------------------------

    // 1. Create the Invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        invoiceNumber: invoiceNumber, // Use the new formatted number
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
