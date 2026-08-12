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

      return await this.prisma.workOrder.create({
        data: {
          woNumber,
          title: data.title,
          description: data.description || null,
          priority: data.priority || 'MEDIUM',
          status: 'PENDING',
          customerId: data.customerId || null,
          buildingId: data.buildingId || null,
          flatId: data.flatId || null,
          assetId: data.assetId || null,
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
          companyId: company.id,
        },
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

  async update(id: string, data: any) {
    let serviceReportNumber = data.serviceReportNumber;
    if (!serviceReportNumber) {
      const count = await this.prisma.workOrder.count({ where: { serviceReportNumber: { not: null } } });
      serviceReportNumber = `SR-${String(count + 1).padStart(4, '0')}`;
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        workPerformed: data.workPerformed || null,
        observations: data.observations || null,
        materialsUsed: data.materialsUsed || null,
        clientSignature: data.clientSignature || null,
        technicianName: data.technicianName || 'Technician',
        serviceReportNumber: serviceReportNumber,
        startedAt: data.startedAt ? new Date(data.startedAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
      },
    });
  }
}
