import { Controller, Get, Post, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Roles } from '../auth/roles.decorator';

@Controller('customers')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COORDINATOR', 'ACCOUNTANT')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() body: any) {
    return this.customersService.create(body);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
