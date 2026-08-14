import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const company = await this.prisma.company.findFirst();
    if (!company) throw new Error('No company exists in the database.');

    return this.prisma.$executeRaw`
      INSERT INTO "Purchase" (
        id, "companyId", "supplierName", "billNumber", "purchaseDate", 
        "dueDate", "workOrderId", "assetId", "items", "subtotal", 
        "vatAmount", "totalAmount", "paymentStatus", "paymentMethod", "receiptUrl"
      ) VALUES (
        gen_random_uuid()::text, ${company.id}, ${data.supplierName}, ${data.billNumber}, 
        ${data.purchaseDate ? new Date(data.purchaseDate) : null}, 
        ${data.dueDate ? new Date(data.dueDate) : null}, 
        ${data.workOrderId || null}, ${data.assetId || null}, 
        ${JSON.stringify(data.items || [])}::jsonb, ${data.subtotal || 0}, 
        ${data.vatAmount || 0}, ${data.totalAmount || 0}, 
        ${data.paymentStatus || 'UNPAID'}, ${data.paymentMethod || 'CASH'}, 
        ${data.receiptUrl || null}
      )
      RETURNING *;
    `;
  }

  async findAll() {
    // Using raw query because Prisma client wasn't regenerated for this table
    const result = await this.prisma.$queryRaw`
      SELECT * FROM "Purchase" ORDER BY "createdAt" DESC;
    `;
    return result;
  }
}
