import { IsString, IsOptional, IsArray, IsNumber, IsBoolean, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class InvoiceLineItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  @IsOptional()
  vatPercent?: number = 5;
}

export class CreateInvoiceDto {
  @IsString()
  customerId: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  workOrderId?: string;

  @IsBoolean()
  @IsOptional()
  isAdhoc?: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineItemDto)
  lineItems: InvoiceLineItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  status?: string;
}

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  method: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
