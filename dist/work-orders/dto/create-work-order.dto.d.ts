import { Priority, WOStatus } from '@prisma/client';
export declare class CreateWorkOrderDto {
    title: string;
    description?: string;
    categoryId: string;
    customerId?: string;
    buildingId?: string;
    flatId?: string;
    assetId?: string;
    technicianId?: string;
    priority?: Priority;
    scheduledAt?: string;
    formSchema?: string;
}
export declare class UpdateWorkOrderDto {
    status?: WOStatus;
    technicianId?: string;
    scheduledAt?: string;
    formData?: string;
    materials?: string;
    laborCost?: number;
    customerSignature?: string;
    photos?: string[];
}
