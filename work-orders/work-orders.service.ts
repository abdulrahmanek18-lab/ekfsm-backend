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

  async update(id: string, companyId: string, dto: any) {
    const wo = await this.prisma.workOrder.findFirst({ where: { id, companyId } });
    if (!wo) throw new NotFoundException('Work order not found');

    return this.prisma.workOrder.update({
      where: { id },
      data: {
        ...dto,
        scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : undefined,
        startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
      },
      include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
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
