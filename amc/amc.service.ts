import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AMCStatus, AMCPaymentType, PPMStatus, EMIStatus } from '@prisma/client';

@Injectable()
export class AmcService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const amc = await this.prisma.aMC.create({
      data: {
        companyId: dto.companyId,
        customerId: dto.customerId,
        assetId: dto.assetId,
        serviceCategoryId: dto.serviceCategoryId,
        contractNumber: dto.contractNumber,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        value: dto.value,
        paymentType: dto.paymentType || AMCPaymentType.LUMPSUM,
        ppmFrequency: dto.ppmFrequency || 3,
        status: AMCStatus.ACTIVE,
      },
    });

    // Auto-generate PPM schedules
    if (dto.ppmFrequency) {
      const schedules = [];
      const months = 12 / dto.ppmFrequency;
      for (let i = 0; i < months; i++) {
        const date = new Date(dto.startDate);
        date.setMonth(date.getMonth() + i * dto.ppmFrequency);
        schedules.push({
          amcId: amc.id,
          scheduledAt: date,
          status: PPMStatus.SCHEDULED,
        });
      }
      await this.prisma.pPMSchedule.createMany({ data: schedules });
    }

    // Auto-generate EMI schedules
    if (dto.paymentType === AMCPaymentType.EMI && dto.emiCount) {
      const emiAmount = dto.value / dto.emiCount;
      const emis = [];
      for (let i = 0; i < dto.emiCount; i++) {
        const date = new Date(dto.startDate);
        date.setMonth(date.getMonth() + i);
        emis.push({
          amcId: amc.id,
          amount: parseFloat(emiAmount.toFixed(2)),
          dueDate: date,
          status: EMIStatus.PENDING,
        });
      }
      await this.prisma.eMISchedule.createMany({ data: emis });
    }

    return amc;
  }

  async findAll(companyId: string) {
    return this.prisma.aMC.findMany({
      where: { companyId },
      include: { asset: true, ppmSchedules: true, emiSchedules: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const amc = await this.prisma.aMC.findFirst({
      where: { id, companyId },
      include: { asset: { include: { flat: { include: { building: true } } } }, ppmSchedules: true, emiSchedules: true },
    });
    if (!amc) throw new NotFoundException('AMC not found');
    return amc;
  }

  async update(id: string, companyId: string, dto: any) {
    const amc = await this.prisma.aMC.findFirst({ where: { id, companyId } });
    if (!amc) throw new NotFoundException('AMC not found');

    return this.prisma.aMC.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
      include: { asset: true, ppmSchedules: true, emiSchedules: true },
    });
  }

  async remove(id: string, companyId: string) {
    const amc = await this.prisma.aMC.findFirst({ where: { id, companyId } });
    if (!amc) throw new NotFoundException('AMC not found');
    await this.prisma.aMC.delete({ where: { id } });
    return { deleted: true };
  }
}
