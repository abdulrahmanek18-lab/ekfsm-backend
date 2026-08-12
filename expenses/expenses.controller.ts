import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Roles } from '../auth/roles.decorator';

@Controller('expenses')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTANT') // <--- ADD THIS
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() body: any) {
    return this.expensesService.create(body);
  }

  @Get()
  findAll() {
    return this.expensesService.findAll();
  }
}
