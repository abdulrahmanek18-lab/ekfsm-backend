declare class InvoiceLineItemDto {
    description: string;
    quantity: number;
    unitPrice: number;
    vatPercent?: number;
}
export declare class CreateInvoiceDto {
    customerId: string;
    dueDate?: string;
    workOrderId?: string;
    isAdhoc?: boolean;
    lineItems: InvoiceLineItemDto[];
    notes?: string;
}
export declare class UpdateInvoiceDto {
    status?: string;
}
export declare class CreatePaymentDto {
    amount: number;
    method: string;
    reference?: string;
}
export {};
