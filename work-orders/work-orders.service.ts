import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkOrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // The exact Company ID you confirmed exists in Supabase
    const COMPANY_ID = '00000000-0000-0000-0000-000000000001';

    const count = await this.prisma.workOrder.count();
    const woNumber = `WO-${String(count + 1).padStart(5, '0')}`;

    // We build the payload using Prisma's strict 'connect' syntax
    const createData: any = {
      woNumber,
      title: data.title,
      description: data.description || null,
      priority: data.priority || 'MEDIUM',
      status: 'PENDING',
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
      
      // 1. Connect the Company (This fixes the missing argument error)
      company: {
        connect: { id: COMPANY_ID }
      }
    };

    // 2. Connect Customer only if a valid ID was selected
    if (data.customerId && data.customerId !== "") {
      createData.customer = { connect: { id: data.customerId } };
    }

    // 3. Connect Building only if a valid ID was selected
    if (data.buildingId && data.buildingId !== "") {
      createData.building = { connect: { id: data.buildingId } };
    }

    // 4. Connect Flat only if a valid ID was selected
    if (data.flatId && data.flatId !== "") {
      createData.flat = { connect: { id: data.flatId } };
    }

    // 5. Connect Asset only if a valid ID was selected
    if (data.assetId && data.assetId !== "") {
      createData.asset = { connect: { id: data.assetId } };
    }

    try {
      return await this.prisma.workOrder.create({
        data: createData,
        include: { customer: true, building: true, asset: true }
      });
    } catch (error) {
      console.error('PRISMA ERROR CREATING WORK ORDER:', error);
      throw new Error(error.message);
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
