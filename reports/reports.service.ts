import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardKPIs(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalJobs,
      pendingJobs,
      inProgressJobs,
      completedToday,
      overdueJobs,
      totalInvoices,
      pendingInvoices,
      totalRevenue,
      lowStockItems,
      upcomingPPM,
    ] = await Promise.all([
      this.prisma.workOrder.count({ where: { companyId } }),
      this.prisma.workOrder.count({ where: { companyId, status: 'PENDING' } }),
      this.prisma.workOrder.count({ where: { companyId, status: 'IN_PROGRESS' } }),
      this.prisma.workOrder.count({ where: { companyId, status: 'COMPLETED', completedAt: { gte: today, lt: tomorrow } } }),
      this.prisma.workOrder.count({ where: { companyId, status: { in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] }, scheduledAt: { lt: today } } }),
      this.prisma.invoice.count({ where: { companyId } }),
      this.prisma.invoice.count({ where: { companyId, status: { in: ['DRAFT', 'SENT', 'PARTIAL', 'OVERDUE'] } } }),
      this.prisma.invoice.aggregate({ where: { companyId, status: 'PAID' }, _sum: { totalAmount: true } }),
      this.prisma.inventoryItem.count({ where: { companyId, quantity: { lte: { minStock: true } } } }),
      this.prisma.pPMSchedule.count({ where: { amc: { companyId }, scheduledAt: { gte: today, lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) }, status: 'SCHEDULED' } }),
    ]);

    return {
      jobs: { total: totalJobs, pending: pendingJobs, inProgress: inProgressJobs, completedToday, overdue: overdueJobs },
      invoices: { total: totalInvoices, pending: pendingInvoices, totalRevenue: totalRevenue._sum.totalAmount || 0 },
      inventory: { lowStock: lowStockItems },
      amc: { upcomingPPM },
    };
  }

  async getJobReport(companyId: string, startDate: string, endDate: string) {
    const jobs = await this.prisma.workOrder.findMany({
      where: {
        companyId,
        createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
      },
      include: {
        category: true,
        technician: { select: { name: true } },
        flat: { include: { building: true } },
      },
    });

    const byCategory = {};
    const byTechnician = {};
    const byStatus = {};

    for (const job of jobs) {
      const cat = job.category.name;
      byCategory[cat] = (byCategory[cat] || 0) + 1;

      const tech = job.technician?.name || 'Unassigned';
      byTechnician[tech] = (byTechnician[tech] || 0) + 1;

      byStatus[job.status] = (byStatus[job.status] || 0) + 1;
    }

    return { total: jobs.length, byCategory, byTechnician, byStatus, jobs };
  }

  async getTechnicianPerformance(companyId: string, startDate: string, endDate: string) {
    const technicians = await this.prisma.user.findMany({
      where: { companyId, role: 'TECHNICIAN' },
      include: {
        assignedWorkOrders: {
          where: {
            completedAt: { gte: new Date(startDate), lte: new Date(endDate) },
          },
        },
      },
    });

    return technicians.map(t => ({
      id: t.id,
      name: t.name,
      totalCompleted: t.assignedWorkOrders.length,
      avgCompletionTime: t.assignedWorkOrders.length > 0
        ? t.assignedWorkOrders.reduce((sum, wo) => {
            if (wo.startedAt && wo.completedAt) {
              return sum + (new Date(wo.completedAt).getTime() - new Date(wo.startedAt).getTime());
            }
            return sum;
          }, 0) / t.assignedWorkOrders.length / (1000 * 60 * 60) // hours
        : 0,
    }));
  }
}
