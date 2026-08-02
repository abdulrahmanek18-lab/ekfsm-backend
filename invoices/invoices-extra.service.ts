import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';

@Injectable()
export class InvoicesExtraService {
  constructor(private readonly prisma: PrismaService) {}

  async updateStatus(id: string, companyId: string, status: InvoiceStatus) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return this.prisma.invoice.update({ where: { id }, data: { status } });
  }

  async voidInvoice(id: string, companyId: string, reason: string) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return this.prisma.invoice.update({
      where: { id },
      data: { status: InvoiceStatus.VOID, isVoid: true, voidReason: reason },
    });
  }
}
