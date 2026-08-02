import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const subtotal = Number(dto.subtotal) || 0;
    const vatRate = Number(dto.vatRate) || 5;
    const vatAmount = parseFloat((subtotal * (vatRate / 100)).toFixed(2));
    const total = parseFloat((subtotal + vatAmount).toFixed(2));

    const invoice = await this.prisma.invoice.create({
      data: {
        companyId: dto.companyId,
        customerId: dto.customerId,
        workOrderId: dto.workOrderId,
        invoiceNumber: dto.invoiceNumber,
        issueDate: new Date(),
        dueDate: new Date(dto.dueDate),
        subtotal,
        vatRate,
        vatAmount,
        total,
        balanceDue: total,
        status: InvoiceStatus.DRAFT,
        notes: dto.notes,
      },
      include: { customer: true, workOrder: true },
    });

    return invoice;
  }

  async findAll(companyId: string, filters?: any) {
    const where: any = { companyId };
    if (filters?.status) where.status = filters.status;
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.from && filters?.to) {
      where.issueDate = {
        gte: new Date(filters.from),
        lte: new Date(filters.to),
      };
    }

    return this.prisma.invoice.findMany({
      where,
      include: { customer: true, workOrder: true, payments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, companyId },
      include: { customer: true, workOrder: true, payments: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async update(id: string, companyId: string, dto: any) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: { customer: true, workOrder: true, payments: true },
    });
  }

  async remove(id: string, companyId: string) {
    const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    await this.prisma.invoice.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Payments ──

  async addPayment(invoiceId: string, companyId: string, dto: any) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id: invoiceId, companyId },
      include: { payments: true },
    });
    if (!invoice) throw new NotFoundException('Invoice not found');

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        amount: Number(dto.amount),
        method: dto.method as PaymentMethod,
        referenceNo: dto.referenceNo,
        notes: dto.notes,
      },
    });

    // Update invoice status
    const totalPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0) + Number(dto.amount);
    let status: InvoiceStatus = InvoiceStatus.PARTIAL;
    if (totalPaid >= Number(invoice.total)) status = InvoiceStatus.PAID;

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { amountPaid: totalPaid, balanceDue: Math.max(0, Number(invoice.total) - totalPaid), status },
    });

    return payment;
  }

  // ── VAT Report ──

  async getVatReport(companyId: string, from: string, to: string) {
    const invoices = await this.prisma.invoice.findMany({
      where: {
        companyId,
        issueDate: { gte: new Date(from), lte: new Date(to) },
        status: { not: InvoiceStatus.VOID },
      },
      include: { customer: true },
    });

    // Get company TRN separately
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { trn: true },
    });

    let totalTaxable = 0;
    let totalVat = 0;
    let totalAmount = 0;

    const rows = invoices.map((inv) => {
      totalTaxable += Number(inv.subtotal);
      totalVat += Number(inv.vatAmount);
      totalAmount += Number(inv.total);
      return {
        invoiceNumber: inv.invoiceNumber,
        issueDate: inv.issueDate,
        customer: inv.customer?.name,
        trn: inv.customer?.trn,
        taxableAmount: inv.subtotal,
        vatRate: inv.vatRate,
        vatAmount: inv.vatAmount,
        totalAmount: inv.total,
      };
    });

    return {
      period: { from, to },
      companyTrn: company?.trn,
      summary: { totalTaxable, totalVat, totalAmount, invoiceCount: invoices.length },
      rows,
    };
  }
}
