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

      // Helper function: if the value is empty string, return null
      const clean = (val) => (val === "" || val === undefined) ? null : val;

      return await this.prisma.workOrder.create({
        data: {
          woNumber,
          title: data.title,
          description: clean(data.description),
          priority: data.priority || 'MEDIUM',
          status: 'PENDING',
          
          // Explicitly connect the company
          company: { 
            connect: { id: company.id } 
          },
          
          // Connect other relations if they exist
          customer: clean(data.customerId) ? { connect: { id: clean(data.customerId) } } : undefined,
          building: clean(data.buildingId) ? { connect: { id: clean(data.buildingId) } } : undefined,
          flat: clean(data.flatId) ? { connect: { id: clean(data.flatId) } } : undefined,
          asset: clean(data.assetId) ? { connect: { id: clean(data.assetId) } } : undefined,
          
          scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        },
        include: {
          customer: true,
          building: true,
          asset: true
        }
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
