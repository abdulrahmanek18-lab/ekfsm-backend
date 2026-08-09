import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AmcService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) {
      throw new Error('No company exists in the database.');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const value = parseFloat(dto.value);
    const ppmFrequency = parseInt(dto.ppmFrequency) || 3; // Default to every 3 months
    const emiCount = parseInt(dto.emiCount) || 0; // Number of EMIs

    // 1. Calculate PPM Dates
    const ppmSchedules = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      ppmSchedules.push({ scheduledAt: new Date(currentDate) });
      currentDate.setMonth(currentDate.getMonth() + ppmFrequency);
    }

    // 2. Calculate EMI Dates and Amounts
    const emiSchedules = [];
    if (dto.paymentType === 'EMI' && emiCount > 0) {
      const emiAmount = value / emiCount;
      let emiDate = new Date(startDate);
      for (let i = 0; i < emiCount; i++) {
        emiSchedules.push({
          amount: emiAmount,
          dueDate: new Date(emiDate),
        });
        emiDate.setMonth(emiDate.getMonth() + 1); // EMIs are monthly
      }
    }

    // 3. Save AMC + Schedules to Database
    return this.prisma.aMC.create({
      data: {
        contractNumber: dto.contractNumber,
        startDate: startDate,
        endDate: endDate,
        value: value,
        paymentType: dto.paymentType,
        ppmFrequency: ppmFrequency,
        customerId: dto.customerId,
        companyId: company.id,
        
        // Automatically create the PPM and EMI records linked to this AMC!
        ppmSchedules: { create: ppmSchedules },
        emiSchedules: { create: emiSchedules },
      },
      include: { ppmSchedules: true, emiSchedules: true },
    });
  }

  async findAll(companyId?: string) {
    return this.prisma.aMC.findMany({
      where: companyId ? { companyId } : {},
      include: { customer: true, ppmSchedules: true, emiSchedules: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
