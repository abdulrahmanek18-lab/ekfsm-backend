import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WOStatus, Priority } from '@prisma/client';

@Injectable()
export class WorkOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    // Auto-generate WO number
    const count = await this.prisma.workOrder.count({ where: { companyId: dto.companyId } });
    const woNumber = `${dto.prefix || 'WO-'}${String(count + 1).padStart(5, '0')}`;

    return this.prisma.workOrder.create({
      data: {
        companyId: dto.companyId,
        customerId: dto.customerId,
        buildingId: dto.buildingId,
        flatId: dto.flatId,
        assetId: dto.assetId,
        serviceCategoryId: dto.serviceCategoryId,
        technicianId: dto.technicianId,
        woNumber,
        title: dto.title,
        description: dto.description,
        priority: dto.priority || Priority.MEDIUM,
        status: WOStatus.PENDING,
        scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
      },
      include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
    });
  }

  async findAll(companyId: string, filters?: any) {
    const where: any = { companyId };
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    if (filters?.technicianId) where.technicianId = filters.technicianId;
    if (filters?.customerId) where.customerId = filters.customerId;

    return this.prisma.workOrder.findMany({
      where,
      include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const wo = await this.prisma.workOrder.findFirst({
      where: { id, companyId },
      include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true, itemsUsed: { include: { item: true } } },
    });
    if (!wo) throw new NotFoundException('Work order not found');
    return wo;
  }

    async update(id: string, data: any) {
    // Generate a Service Report Number if it doesn't exist yet
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
        // Save the Start and End times!
        startedAt: data.startedAt ? new Date(data.startedAt) : null,
        completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
      },
    });
  }
  async startWork(id: string, companyId: string, technicianId: string) {
    return this.prisma.workOrder.update({
      where: { id },
      data: { status: WOStatus.IN_PROGRESS, technicianId, startedAt: new Date() },
      include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
    });
  }

  async completeWork(id: string, companyId: string, dto: any) {
    const wo = await this.prisma.workOrder.findFirst({ where: { id, companyId } });
    if (!wo) throw new NotFoundException('Work order not found');

    // Deduct inventory if items used
    if (dto.itemsUsed?.length) {
      for (const used of dto.itemsUsed) {
        await this.prisma.inventoryItem.update({
          where: { id: used.itemId },
          data: { quantity: { decrement: used.quantity } },
        });
        await this.prisma.itemUsed.create({
          data: {
            workOrderId: id,
            itemId: used.itemId,
            quantity: used.quantity,
            unitCost: used.unitCost,
            totalCost: used.totalCost,
          },
        });
      }
    }

    return this.prisma.workOrder.update({
      where: { id },
      data: {
        status: WOStatus.COMPLETED,
        completedAt: new Date(),
        actualCost: dto.actualCost,
        technicianNotes: dto.technicianNotes,
      },
      include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true, itemsUsed: { include: { item: true } } },
    });
  }

  async remove(id: string, companyId: string) {
    const wo = await this.prisma.workOrder.findFirst({ where: { id, companyId } });
    if (!wo) throw new NotFoundException('Work order not found');
    await this.prisma.workOrder.delete({ where: { id } });
    return { deleted: true };
  }
}
  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    const count = await this.prisma.workOrder.count();
    const woNumber = `WO-${String(count + 1).padStart(4, '0')}`;

    return this.prisma.workOrder.create({
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
  }
