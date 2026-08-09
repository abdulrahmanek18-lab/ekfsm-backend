import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    // Find the first company in the database
    const company = await this.prisma.company.findFirst();
    
    if (!company) {
      throw new Error('No company exists in the database. Please create a company first.');
    }

    return this.prisma.customer.create({
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        companyId: company.id, 
      },
    });
  }

  async findAll() {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
