import { Controller } from '@nestjs/common';
import {POService} from './po.service';

@Controller('po')
export class POController {
  constructor(private readonly service: POService) {}
}
