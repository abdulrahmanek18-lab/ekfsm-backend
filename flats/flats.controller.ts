import { Controller } from '@nestjs/common';
import {FlatsService} from './flats.service';

@Controller('flats')
export class FlatsController {
  constructor(private readonly service: FlatsService) {}
}
