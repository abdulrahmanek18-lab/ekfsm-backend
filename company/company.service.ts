import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getSettings() {
    // Finds the first company in the database
    const company = await this.prisma.company.findFirst();
    if (!company) {
      // If no company exists, create a default empty one automatically
      return this.prisma.company.create({ data: { name: 'My Company' } });
    }
    return company;
  }

  async updateSettings(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) {
      // Create if it doesn't exist
      return this.prisma.company.create({ data });
    }
    // Update the existing company
    return this.prisma.company.update({
      where: { id: company.id },
      data: {
        name: data.name,
        trn: data.trn,
        address: data.address,
        phone: data.phone,
        email: data.email,
        logoUrl: data.logoUrl, // Will store the image as a Base64 string
        invoiceHeader: data.invoiceHeader,
        invoiceFooter: data.invoiceFooter,
        vatPercent: parseFloat(data.vatPercent) || 5,
        invoicePrefix: data.invoicePrefix,
        poPrefix: data.poPrefix,
        woPrefix: data.woPrefix,
        amcPrefix: data.amcPrefix,
      },
    });
  }
}
