import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      // 1. Find the company
      const company = await this.prisma.company.findFirst();
      
      // 2. If no company exists, throw a clear error
      if (!company) {
        throw new Error('No company exists in the database. Please create a company first.');
      }

      const count = await this.prisma.workOrder.count();
      const woNumber = `WO-${String(count + 1).padStart(4, '0')}`;

      // Helper function: if the value is empty string, return null
      const clean = (val) => (val === "" || val === undefined) ? null : val;

      // 3. Build the data object safely
      const createData: any = {
        woNumber,
        title: data.title,
        description: clean(data.description),
        priority: data.priority || 'MEDIUM',
        status: 'PENDING',
        companyId: company.id, // Directly assign the ID
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
      };

      // Only add these if they have a valid value
      if (clean(data.customerId)) createData.customerId = clean(data.customerId);
      if (clean(data.buildingId)) createData.buildingId = clean(data.buildingId);
      if (clean(data.flatId)) createData.flatId = clean(data.flatId);
      if (clean(data.assetId)) createData.assetId = clean(data.assetId);

      return await this.prisma.workOrder.create({
        data: createData,
        include: {
          customer: true,
          building: true,
          asset: true
        }
      });
    } catch (error) {
      console.error('Error creating Work Order:', error.message);
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
