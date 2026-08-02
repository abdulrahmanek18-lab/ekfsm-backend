import { PrismaService } from '../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';
export declare class InvoicesExtraService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    updateStatus(id: string, companyId: string, status: InvoiceStatus): Promise<{
        status: import(".prisma/client").$Enums.InvoiceStatus;
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        workOrderId: string | null;
        invoiceNumber: string;
        issueDate: Date;
        dueDate: Date;
        subtotal: number;
        vatRate: number;
        vatAmount: number;
        total: number;
        amountPaid: number;
        balanceDue: number;
        notes: string | null;
        isVoid: boolean;
        voidReason: string | null;
    }>;
    voidInvoice(id: string, companyId: string, reason: string): Promise<{
        status: import(".prisma/client").$Enums.InvoiceStatus;
        id: string;
        companyId: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        workOrderId: string | null;
        invoiceNumber: string;
        issueDate: Date;
        dueDate: Date;
        subtotal: number;
        vatRate: number;
        vatAmount: number;
        total: number;
        amountPaid: number;
        balanceDue: number;
        notes: string | null;
        isVoid: boolean;
        voidReason: string | null;
    }>;
}
