import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(companyId: string) {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const lastMonthStart = startOfMonth(subMonths(today, 1));
    const lastMonthEnd = endOfMonth(subMonths(today, 1));

    const [
      totalBuildings,
      activeWorkOrders,
      overdueWorkOrders,
      totalAssets,
      totalInvoices,
      pendingInvoices,
      totalRevenue,
      lowStockItems,
      workOrdersThisMonth,
      workOrdersLastMonth,
    ] = await Promise.all([
      this.prisma.building.count({ where: { companyId } }),
      this.prisma.workOrder.count({ where: { companyId, status: { in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] } } }),
      // FIX #1: scheduledAt → scheduledDate
      this.prisma.workOrder.count({ where: { companyId, status: { in: ['PENDING', 'ASSIGNED', 'IN_PROGRESS'] }, scheduledDate: { lt: today } } }),
      this.prisma.asset.count({ where: { companyId } }),
      this.prisma.invoice.count({ where: { companyId } }),
      this.prisma.invoice.count({ where: { companyId, status: 'PENDING' } }),
      // FIX #2: totalAmount → total
      this.prisma.invoice.aggregate({ where: { companyId, status: 'PAID' }, _sum: { total: true } }),
      // FIX #3: Can't compare two columns in Prisma directly. Fetch and filter in JS, or use raw query.
      // Option A: Fetch all and filter (simple, but loads all data)
      this.prisma.inventoryItem.findMany({ where: { companyId } }).then(items => 
        items.filter(item => item.quantity <= item.minStock).length
      ),
      // Option B (better for large datasets): Raw SQL
      // this.prisma.$queryRaw<number>`SELECT COUNT(*) FROM "InventoryItem" WHERE "companyId" = ${companyId} AND "quantity" <= "minStock"`.then(r => Number(r[0].count)),
      this.prisma.workOrder.count({ where: { companyId, createdAt: { gte: monthStart, lte: monthEnd } } }),
      this.prisma.workOrder.count({ where: { companyId, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    ]);

    return {
      buildings: { total: totalBuildings },
      workOrders: { 
        active: activeWorkOrders, 
        overdue: overdueWorkOrders,
        thisMonth: workOrdersThisMonth,
        lastMonth: workOrdersLastMonth,
        trend: workOrdersLastMonth > 0 ? ((workOrdersThisMonth - workOrdersLastMonth) / workOrdersLastMonth * 100).toFixed(1) : 0
      },
      assets: { total: totalAssets },
      inventory: { lowStock: lowStockItems },
      // FIX #4: totalRevenue._sum.totalAmount → totalRevenue._sum.total
      invoices: { total: totalInvoices, pending: pendingInvoices, totalRevenue: totalRevenue._sum.total || 0 },
    };
  }

  async getWorkOrderReport(companyId: string, startDate: Date, endDate: Date) {
    const workOrders = await this.prisma.workOrder.findMany({
      where: { 
        companyId, 
        createdAt: { gte: startDate, lte: endDate } 
      },
      include: {
        building: true,
        flat: true,
        customer: true,
        // FIX #5: Include technician relation to access technician.name
        technician: true,
        // FIX #6: Remove 'category: true' unless you have a category relation in schema
        // If you DO have a category relation, verify the exact relation name in schema.prisma
      },
    });

    const byStatus = {};
    const byBuilding = {};
    // FIX #7: Remove category grouping if category relation doesn't exist
    // If you have a ServiceCategory or similar model linked to WorkOrder, adjust accordingly
    const byTechnician = {};

    for (const job of workOrders) {
      // Status grouping
      byStatus[job.status] = (byStatus[job.status] || 0) + 1;
      
      // Building grouping
      const bldg = job.building?.name || 'Unknown';
      byBuilding[bldg] = (byBuilding[bldg] || 0) + 1;

      // FIX #8: Use technician relation (included above)
      const tech = job.technician?.name || 'Unassigned';
      byTechnician[tech] = (byTechnician[tech] || 0) + 1;
    }

    return {
      total: workOrders.length,
      byStatus,
      byBuilding,
      byTechnician,
      workOrders,
    };
  }

  async getTechnicianPerformance(companyId: string, startDate: Date, endDate: Date) {
    // FIX #9: Change 'assignedWorkOrders' to the actual relation name in your schema
    // Common Prisma convention: if User has @relation("technician") on WorkOrder, 
    // the back-relation on User might be called 'workOrders' or 'technicianWorkOrders'
    // Check your schema.prisma for the exact relation field name on User pointing to WorkOrder
    const technicians = await this.prisma.user.findMany({
      where: { 
        companyId, 
        role: 'TECHNICIAN',
        isActive: true 
      },
      include: {
        // Verify this relation name in your schema.prisma:
        // It should match the back-relation field on User model
        workOrders: {
          where: {
            createdAt: { gte: startDate, lte: endDate },
            status: 'COMPLETED',
          },
        },
      },
    });

    // FIX #10: Use the correct relation name from the include above
    return technicians.map(t => ({
      id: t.id,
      name: t.name,
      email: t.email,
      // FIX #11: Match the relation name used in include
      totalCompleted: t.workOrders?.length || 0,
      avgCompletionTime: t.workOrders?.length > 0
        ? t.workOrders.reduce((sum, wo) => {
            if (wo.completedAt && wo.startedAt) {
              return sum + (wo.completedAt.getTime() - wo.startedAt.getTime());
            }
            return sum;
          }, 0) / t.workOrders.length / (1000 * 60 * 60) // hours
        : 0,
    }));
  }
}
