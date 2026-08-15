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

      return await this.prisma.workOrder.create({
        data: {
          woNumber,
          title: data.title,
          description: clean(data.description),
          priority: data.priority || 'MEDIUM',
          status: 'PENDING',
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
          companyId: company.id,
          customerId: clean(data.customerId) || undefined,
          buildingId: clean(data.buildingId) || undefined,
          flatId: clean(data.flatId) || undefined,
          technicianId: clean(data.technicianId) || undefined,
        },
      });
    } catch (error) {
      console.error('Error creating Work Order:', error);
      throw new Error(error.message || 'Failed to create Work Order');
    }
  }

  async findAll() {
    return this.prisma.workOrder.findMany({
      include: { 
        customer: true, 
        building: true, 
        flat: true,
        technician: true 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.workOrder.findUnique({
      where: { id },
      include: { customer: true, building: true, flat: true, technician: true },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.workOrder.update({
      where: { id },
      data: { status: status as any }, // Cast to any to fix TypeScript build error
    });
  }

  async update(id: string, data: any) {
    return this.prisma.workOrder.update({
      where: { id },
      data: {
        status: data.status || undefined,
        // FIX: Allow assigning/updating technician
        technicianId: data.technicianId !== undefined ? (data.technicianId || null) : undefined,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
    });
  }
}
