import { IsString, IsOptional, IsEnum, IsJSON, IsDateString, IsNumber, IsDecimal } from 'class-validator';
import { Priority, WOStatus } from '@prisma/client';

export class CreateWorkOrderDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  buildingId?: string;

  @IsString()
  @IsOptional()
  flatId?: string;

  @IsString()
  @IsOptional()
  assetId?: string;

  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority = Priority.MEDIUM;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsString()
  @IsOptional()
  formSchema?: string;
}

export class UpdateWorkOrderDto {
  @IsEnum(WOStatus)
  @IsOptional()
  status?: WOStatus;

  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsString()
  @IsOptional()
  formData?: string;

  @IsString()
  @IsOptional()
  materials?: string;

  @IsNumber()
  @IsOptional()
  laborCost?: number;

  @IsString()
  @IsOptional()
  customerSignature?: string;

  @IsString({ each: true })
  @IsOptional()
  photos?: string[];
}
