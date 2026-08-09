import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    // Prisma requires createdById. We will grab the first user to act as the creator.
    const user = await this.prisma.user.findFirst();
    if (!user) throw new Error('No user exists in the database.');

    return this.prisma.expense.create({
      data: {
        category: data.category,
        amount: parseFloat(data.amount),
        description: data.description || null,
        companyId: company.id,
        createdById: user.id, 
        status: 'PENDING', // Default status for expenses
      },
    });
  }

  async findAll() {
    return this.prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
