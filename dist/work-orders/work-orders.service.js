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
exports.WorkOrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WorkOrdersService = class WorkOrdersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const count = await this.prisma.workOrder.count({ where: { companyId: dto.companyId } });
        const woNumber = `${dto.prefix || 'WO-'}${String(count + 1).padStart(5, '0')}`;
        return this.prisma.workOrder.create({
            data: {
                companyId: dto.companyId,
                customerId: dto.customerId,
                buildingId: dto.buildingId,
                flatId: dto.flatId,
                assetId: dto.assetId,
                serviceCategoryId: dto.serviceCategoryId,
                technicianId: dto.technicianId,
                woNumber,
                title: dto.title,
                description: dto.description,
                priority: dto.priority || client_1.Priority.MEDIUM,
                status: client_1.WOStatus.PENDING,
                scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
            },
            include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
        });
    }
    async findAll(companyId, filters) {
        const where = { companyId };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.priority)
            where.priority = filters.priority;
        if (filters?.technicianId)
            where.technicianId = filters.technicianId;
        if (filters?.customerId)
            where.customerId = filters.customerId;
        return this.prisma.workOrder.findMany({
            where,
            include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, companyId) {
        const wo = await this.prisma.workOrder.findFirst({
            where: { id, companyId },
            include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true, itemsUsed: { include: { item: true } } },
        });
        if (!wo)
            throw new common_1.NotFoundException('Work order not found');
        return wo;
    }
    async update(id, companyId, dto) {
        const wo = await this.prisma.workOrder.findFirst({ where: { id, companyId } });
        if (!wo)
            throw new common_1.NotFoundException('Work order not found');
        return this.prisma.workOrder.update({
            where: { id },
            data: {
                ...dto,
                scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : undefined,
                startedAt: dto.startedAt ? new Date(dto.startedAt) : undefined,
                completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
            },
            include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
        });
    }
    async startWork(id, companyId, technicianId) {
        return this.prisma.workOrder.update({
            where: { id },
            data: { status: client_1.WOStatus.IN_PROGRESS, technicianId, startedAt: new Date() },
            include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true },
        });
    }
    async completeWork(id, companyId, dto) {
        const wo = await this.prisma.workOrder.findFirst({ where: { id, companyId } });
        if (!wo)
            throw new common_1.NotFoundException('Work order not found');
        if (dto.itemsUsed?.length) {
            for (const used of dto.itemsUsed) {
                await this.prisma.inventoryItem.update({
                    where: { id: used.itemId },
                    data: { quantity: { decrement: used.quantity } },
                });
                await this.prisma.itemUsed.create({
                    data: {
                        workOrderId: id,
                        itemId: used.itemId,
                        quantity: used.quantity,
                        unitCost: used.unitCost,
                        totalCost: used.totalCost,
                    },
                });
            }
        }
        return this.prisma.workOrder.update({
            where: { id },
            data: {
                status: client_1.WOStatus.COMPLETED,
                completedAt: new Date(),
                actualCost: dto.actualCost,
                technicianNotes: dto.technicianNotes,
            },
            include: { customer: true, building: true, flat: true, asset: true, serviceCategory: true, technician: true, itemsUsed: { include: { item: true } } },
        });
    }
    async remove(id, companyId) {
        const wo = await this.prisma.workOrder.findFirst({ where: { id, companyId } });
        if (!wo)
            throw new common_1.NotFoundException('Work order not found');
        await this.prisma.workOrder.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.WorkOrdersService = WorkOrdersService;
exports.WorkOrdersService = WorkOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkOrdersService);
//# sourceMappingURL=work-orders.service.js.map