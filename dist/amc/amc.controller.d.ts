import { AmcService } from './amc.service';
export declare class AmcController {
    private readonly service;
    constructor(service: AmcService);
    create(dto: any): Promise<{
        status: import(".prisma/client").$Enums.AMCStatus;
        id: string;
        companyId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        assetId: string | null;
        serviceCategoryId: string | null;
        contractNumber: string;
        startDate: Date;
        endDate: Date;
        value: number;
        paymentType: import(".prisma/client").$Enums.AMCPaymentType;
        ppmFrequency: number;
    }>;
    findAll(companyId: string): Promise<({
        asset: {
            model: string | null;
            status: import(".prisma/client").$Enums.AssetStatus;
            id: string;
            companyId: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            buildingId: string | null;
            flatId: string | null;
            serviceCategoryId: string | null;
            location: string | null;
            assetNumber: string;
            manufacturer: string | null;
            serialNumber: string | null;
            installedDate: Date | null;
            warrantyExpiry: Date | null;
        };
        ppmSchedules: {
            status: import(".prisma/client").$Enums.PPMStatus;
            id: string;
            createdAt: Date;
            completedAt: Date | null;
            workOrderId: string | null;
            notes: string | null;
            scheduledAt: Date;
            amcId: string;
        }[];
        emiSchedules: {
            status: import(".prisma/client").$Enums.EMIStatus;
            id: string;
            createdAt: Date;
            dueDate: Date;
            amount: number;
            paidAt: Date | null;
            invoiceId: string | null;
            amcId: string;
        }[];
    } & {
        status: import(".prisma/client").$Enums.AMCStatus;
        id: string;
        companyId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        assetId: string | null;
        serviceCategoryId: string | null;
        contractNumber: string;
        startDate: Date;
        endDate: Date;
        value: number;
        paymentType: import(".prisma/client").$Enums.AMCPaymentType;
        ppmFrequency: number;
    })[]>;
    findOne(id: string, companyId: string): Promise<{
        asset: {
            flat: {
                building: {
                    id: string;
                    companyId: string;
                    name: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    customerId: string;
                    address: string | null;
                    city: string | null;
                    emirate: string | null;
                    latitude: number | null;
                    longitude: number | null;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                buildingId: string;
                unitNumber: string;
                floor: number | null;
                type: string | null;
                areaSqft: number | null;
            };
        } & {
            model: string | null;
            status: import(".prisma/client").$Enums.AssetStatus;
            id: string;
            companyId: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            buildingId: string | null;
            flatId: string | null;
            serviceCategoryId: string | null;
            location: string | null;
            assetNumber: string;
            manufacturer: string | null;
            serialNumber: string | null;
            installedDate: Date | null;
            warrantyExpiry: Date | null;
        };
        ppmSchedules: {
            status: import(".prisma/client").$Enums.PPMStatus;
            id: string;
            createdAt: Date;
            completedAt: Date | null;
            workOrderId: string | null;
            notes: string | null;
            scheduledAt: Date;
            amcId: string;
        }[];
        emiSchedules: {
            status: import(".prisma/client").$Enums.EMIStatus;
            id: string;
            createdAt: Date;
            dueDate: Date;
            amount: number;
            paidAt: Date | null;
            invoiceId: string | null;
            amcId: string;
        }[];
    } & {
        status: import(".prisma/client").$Enums.AMCStatus;
        id: string;
        companyId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        assetId: string | null;
        serviceCategoryId: string | null;
        contractNumber: string;
        startDate: Date;
        endDate: Date;
        value: number;
        paymentType: import(".prisma/client").$Enums.AMCPaymentType;
        ppmFrequency: number;
    }>;
    update(id: string, dto: any): Promise<{
        asset: {
            model: string | null;
            status: import(".prisma/client").$Enums.AssetStatus;
            id: string;
            companyId: string;
            name: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            buildingId: string | null;
            flatId: string | null;
            serviceCategoryId: string | null;
            location: string | null;
            assetNumber: string;
            manufacturer: string | null;
            serialNumber: string | null;
            installedDate: Date | null;
            warrantyExpiry: Date | null;
        };
        ppmSchedules: {
            status: import(".prisma/client").$Enums.PPMStatus;
            id: string;
            createdAt: Date;
            completedAt: Date | null;
            workOrderId: string | null;
            notes: string | null;
            scheduledAt: Date;
            amcId: string;
        }[];
        emiSchedules: {
            status: import(".prisma/client").$Enums.EMIStatus;
            id: string;
            createdAt: Date;
            dueDate: Date;
            amount: number;
            paidAt: Date | null;
            invoiceId: string | null;
            amcId: string;
        }[];
    } & {
        status: import(".prisma/client").$Enums.AMCStatus;
        id: string;
        companyId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        assetId: string | null;
        serviceCategoryId: string | null;
        contractNumber: string;
        startDate: Date;
        endDate: Date;
        value: number;
        paymentType: import(".prisma/client").$Enums.AMCPaymentType;
        ppmFrequency: number;
    }>;
    remove(id: string, companyId: string): Promise<{
        deleted: boolean;
    }>;
}
