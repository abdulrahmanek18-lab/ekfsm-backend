import { Controller, Post, Body, Get } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // Make sure this exists! If it is missing, you will get "Cannot POST"
  @Post()
  create(@Body() createCustomerDto: any) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }
}
