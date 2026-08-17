import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Make sure this path is correct for your project

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getCompany() {
    // Get the first company record, or return an empty object if none exists
    const company = await this.prisma.company.findFirst();
    return company || {};
  }

  async saveCompany(data: any) {
    const existing = await this.prisma.company.findFirst();
    
    if (existing) {
      // Update existing
      return this.prisma.company.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          trn: data.trn,
          phone: data.phone,
          email: data.email,
          logoUrl: data.logoUrl,
          invoiceHeader: data.invoiceHeader,
          invoiceFooter: data.invoiceFooter,
          authorizedSignatureUrl: data.authorizedSignatureUrl,
          companySealUrl: data.companySealUrl,
          vatPercent: parseFloat(data.vatPercent) || 5,
          invoicePrefix: data.invoicePrefix,
          poPrefix: data.poPrefix,
          woPrefix: data.woPrefix,
        },
      });
    }
    
    // Create new
    return this.prisma.company.create({
      data: {
        name: data.name,
        trn: data.trn,
        phone: data.phone,
        email: data.email,
        logoUrl: data.logoUrl,
        invoiceHeader: data.invoiceHeader,
        invoiceFooter: data.invoiceFooter,
        authorizedSignatureUrl: data.authorizedSignatureUrl,
        companySealUrl: data.companySealUrl,
        vatPercent: parseFloat(data.vatPercent) || 5,
        invoicePrefix: data.invoicePrefix,
        poPrefix: data.poPrefix,
        woPrefix: data.woPrefix,
      },
    });
  }
}
