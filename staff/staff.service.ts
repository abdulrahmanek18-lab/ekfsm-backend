import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    return this.prisma.staff.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        photoUrl: data.photoUrl || null,
        jobTitle: data.jobTitle || null,
        nationality: data.nationality || null,
        phone: data.phone || null,
        passportNumber: data.passportNumber || null,
        passportExpiry: data.passportExpiry ? new Date(data.passportExpiry) : null,
        emiratesId: data.emiratesId || null,
        emiratesIdExpiry: data.emiratesIdExpiry ? new Date(data.emiratesIdExpiry) : null,
        visaNumber: data.visaNumber || null,
        visaExpiry: data.visaExpiry ? new Date(data.visaExpiry) : null,
        insuranceProvider: data.insuranceProvider || null,
        insurancePolicyNumber: data.insurancePolicyNumber || null,
        insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : null,
        companyId: company.id,
      },
    });
  }

  async findAll() {
    return this.prisma.staff.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
