"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let InvoicesService = class InvoicesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const subtotal = Number(dto.subtotal) || 0;
        const vatRate = Number(dto.vatRate) || 5;
        const vatAmount = parseFloat((subtotal * (vatRate / 100)).toFixed(2));
        const total = parseFloat((subtotal + vatAmount).toFixed(2));
        const invoice = await this.prisma.invoice.create({
            data: {
                companyId: dto.companyId,
                customerId: dto.customerId,
                workOrderId: dto.workOrderId,
                invoiceNumber: dto.invoiceNumber,
                issueDate: new Date(),
                dueDate: new Date(dto.dueDate),
                subtotal,
                vatRate,
                vatAmount,
                total,
                balanceDue: total,
                status: client_1.InvoiceStatus.DRAFT,
                notes: dto.notes,
            },
            include: { customer: true, workOrder: true },
        });
        return invoice;
    }
    async findAll(companyId, filters) {
        const where = { companyId };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.customerId)
            where.customerId = filters.customerId;
        if (filters?.from && filters?.to) {
            where.issueDate = {
                gte: new Date(filters.from),
                lte: new Date(filters.to),
            };
        }
        return this.prisma.invoice.findMany({
            where,
            include: { customer: true, workOrder: true, payments: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, companyId) {
        const invoice = await this.prisma.invoice.findFirst({
            where: { id, companyId },
            include: { customer: true, workOrder: true, payments: true },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return invoice;
    }
    async update(id, companyId, dto) {
        const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return this.prisma.invoice.update({
            where: { id },
            data: {
                ...dto,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            },
            include: { customer: true, workOrder: true, payments: true },
        });
    }
    async remove(id, companyId) {
        const invoice = await this.prisma.invoice.findFirst({ where: { id, companyId } });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        await this.prisma.invoice.delete({ where: { id } });
        return { deleted: true };
    }
    async addPayment(invoiceId, companyId, dto) {
        const invoice = await this.prisma.invoice.findFirst({
            where: { id: invoiceId, companyId },
            include: { payments: true },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        const payment = await this.prisma.payment.create({
            data: {
                invoiceId,
                amount: Number(dto.amount),
                method: dto.method,
                referenceNo: dto.referenceNo,
                notes: dto.notes,
            },
        });
        const totalPaid = invoice.payments.reduce((sum, p) => sum + Number(p.amount), 0) + Number(dto.amount);
        let status = client_1.InvoiceStatus.PARTIAL;
        if (totalPaid >= Number(invoice.total))
            status = client_1.InvoiceStatus.PAID;
        await this.prisma.invoice.update({
            where: { id: invoiceId },
            data: { amountPaid: totalPaid, balanceDue: Math.max(0, Number(invoice.total) - totalPaid), status },
        });
        return payment;
    }
    async getVatReport(companyId, from, to) {
        const invoices = await this.prisma.invoice.findMany({
            where: {
                companyId,
                issueDate: { gte: new Date(from), lte: new Date(to) },
                status: { not: client_1.InvoiceStatus.VOID },
            },
            include: { customer: true },
        });
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
            select: { trn: true },
        });
        let totalTaxable = 0;
        let totalVat = 0;
        let totalAmount = 0;
        const rows = invoices.map((inv) => {
            totalTaxable += Number(inv.subtotal);
            totalVat += Number(inv.vatAmount);
            totalAmount += Number(inv.total);
            return {
                invoiceNumber: inv.invoiceNumber,
                issueDate: inv.issueDate,
                customer: inv.customer?.name,
                trn: inv.customer?.trn,
                taxableAmount: inv.subtotal,
                vatRate: inv.vatRate,
                vatAmount: inv.vatAmount,
                totalAmount: inv.total,
            };
        });
        return {
            period: { from, to },
            companyTrn: company?.trn,
            summary: { totalTaxable, totalVat, totalAmount, invoiceCount: invoices.length },
            rows,
        };
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map