import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    // 1. Total Invoiced Amount
    const totalInvoices = await this.prisma.invoice.aggregate({
      _sum: { total: true },
      where: { isVoid: false },
    });

    // 2. Paid Invoices Amount
    const paidInvoices = await this.prisma.invoice.aggregate({
      _sum: { total: true },
      where: { status: 'PAID', isVoid: false },
    });

    // 3. Pending Invoices Amount
    const pendingInvoices = await this.prisma.invoice.aggregate({
      _sum: { total: true },
      where: { status: { in: ['SENT', 'DRAFT', 'PARTIAL', 'OVERDUE'] }, isVoid: false },
    });

    // 4. Total Expenses
    const totalExpenses = await this.prisma.expense.aggregate({
      _sum: { amount: true },
      where: { status: 'APPROVED' },
    });

    // 5. Work Order Status Counts
    const woStats = await this.prisma.workOrder.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    return {
      revenue: {
        total: totalInvoices._sum.total || 0,
        paid: paidInvoices._sum.total || 0,
        pending: pendingInvoices._sum.total || 0,
      },
      expenses: {
        total: totalExpenses._sum.amount || 0,
      },
      netProfit: (paidInvoices._sum.total || 0) - (totalExpenses._sum.amount || 0),
      workOrders: woStats,
    };
  }
}
