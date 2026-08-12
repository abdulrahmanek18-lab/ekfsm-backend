import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      const company = await this.prisma.company.findFirst();
      if (!company) throw new Error('No company exists in the database.');

      const count = await this.prisma.workOrder.count();
      const woNumber = `WO-${String(count + 1).padStart(4, '0')}`;

      const clean = (val: any) => (val === "" || val === undefined) ? null : val;

      const createData: any = {
        woNumber,
        title: data.title,
        description: clean(data.description),
        priority: data.priority || 'MEDIUM',
        status: 'PENDING',
        companyId: company.id, 
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
      };

      if (clean(data.customerId)) createData.customerId = clean(data.customerId);
      if (clean(data.buildingId)) createData.buildingId = clean(data.buildingId);
      if (clean(data.flatId)) createData.flatId = clean(data.flatId);
      if (clean(data.assetId)) createData.assetId = clean(data.assetId);

      return await this.prisma.workOrder.create({
        data: createData,
        include: { customer: true, building: true, asset: true }
      });
    } catch (error) {
      console.error('Error creating Work Order:', error);
      throw new Error(error.message || 'Failed to create Work Order');
    }
  }

  async findAll() {
    return this.prisma.workOrder.findMany({
      include: { customer: true, building: true, asset: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.workOrder.findUnique({
      where: { id },
      include: { customer: true, building: true, asset: true },
    });
  }

  // Removed the missing fields so Prisma doesn't crash
  async update(id: string, data: any) {
    return this.prisma.workOrder.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        startedAt: data.startedAt ? new Date(data.startedAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
      },
    });
  }
}
