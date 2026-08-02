import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlatsService {
  constructor(private readonly prisma: PrismaService) {}
}
