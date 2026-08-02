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
exports.AmcService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AmcService = class AmcService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const amc = await this.prisma.aMC.create({
            data: {
                companyId: dto.companyId,
                customerId: dto.customerId,
                assetId: dto.assetId,
                serviceCategoryId: dto.serviceCategoryId,
                contractNumber: dto.contractNumber,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                value: dto.value,
                paymentType: dto.paymentType || client_1.AMCPaymentType.LUMPSUM,
                ppmFrequency: dto.ppmFrequency || 3,
                status: client_1.AMCStatus.ACTIVE,
            },
        });
        if (dto.ppmFrequency) {
            const schedules = [];
            const months = 12 / dto.ppmFrequency;
            for (let i = 0; i < months; i++) {
                const date = new Date(dto.startDate);
                date.setMonth(date.getMonth() + i * dto.ppmFrequency);
                schedules.push({
                    amcId: amc.id,
                    scheduledAt: date,
                    status: client_1.PPMStatus.SCHEDULED,
                });
            }
            await this.prisma.pPMSchedule.createMany({ data: schedules });
        }
        if (dto.paymentType === client_1.AMCPaymentType.EMI && dto.emiCount) {
            const emiAmount = dto.value / dto.emiCount;
            const emis = [];
            for (let i = 0; i < dto.emiCount; i++) {
                const date = new Date(dto.startDate);
                date.setMonth(date.getMonth() + i);
                emis.push({
                    amcId: amc.id,
                    amount: parseFloat(emiAmount.toFixed(2)),
                    dueDate: date,
                    status: client_1.EMIStatus.PENDING,
                });
            }
            await this.prisma.eMISchedule.createMany({ data: emis });
        }
        return amc;
    }
    async findAll(companyId) {
        return this.prisma.aMC.findMany({
            where: { companyId },
            include: { asset: true, ppmSchedules: true, emiSchedules: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, companyId) {
        const amc = await this.prisma.aMC.findFirst({
            where: { id, companyId },
            include: { asset: { include: { flat: { include: { building: true } } } }, ppmSchedules: true, emiSchedules: true },
        });
        if (!amc)
            throw new common_1.NotFoundException('AMC not found');
        return amc;
    }
    async update(id, companyId, dto) {
        const amc = await this.prisma.aMC.findFirst({ where: { id, companyId } });
        if (!amc)
            throw new common_1.NotFoundException('AMC not found');
        return this.prisma.aMC.update({
            where: { id },
            data: {
                ...dto,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            },
            include: { asset: true, ppmSchedules: true, emiSchedules: true },
        });
    }
    async remove(id, companyId) {
        const amc = await this.prisma.aMC.findFirst({ where: { id, companyId } });
        if (!amc)
            throw new common_1.NotFoundException('AMC not found');
        await this.prisma.aMC.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.AmcService = AmcService;
exports.AmcService = AmcService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AmcService);
//# sourceMappingURL=amc.service.js.map