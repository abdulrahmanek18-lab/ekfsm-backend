import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getCompany() {
    const company = await this.prisma.company.findFirst();
    return company || {};
  }

  async saveCompany(data: any) {
    const existing = await this.prisma.company.findFirst();
    
    if (existing) {
      return this.prisma.company.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          trn: data.trn,
          phone: data.phone,
          email: data.email,
          address: data.address,
          vatPercent: parseFloat(data.vatPercent) || 5,
          invoicePrefix: data.invoicePrefix,
          poPrefix: data.poPrefix,
          woPrefix: data.woPrefix,
        },
      });
    }
    
    return this.prisma.company.create({
      data: {
        name: data.name,
        trn: data.trn,
        phone: data.phone,
        email: data.email,
        address: data.address,
        vatPercent: parseFloat(data.vatPercent) || 5,
        invoicePrefix: data.invoicePrefix,
        poPrefix: data.poPrefix,
        woPrefix: data.woPrefix,
      },
    });
  }
}
