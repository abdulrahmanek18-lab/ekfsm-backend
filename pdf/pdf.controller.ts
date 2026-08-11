import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pdf')
@UseGuards(JwtAuthGuard)
export class PdfController {
  constructor(private readonly service: PdfService) {}

  @Post('generate')
  async generate(@Body() dto: { html: string }, @Res() res: Response) {
    const pdf = await this.service.generateFromHtml(dto.html);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf);
  }

  @Post('fill-template')
  async fillTemplate(@Body() dto: { templateBase64: string; data: Record<string, string> }, @Res() res: Response) {
    const buffer = Buffer.from(dto.templateBase64, 'base64');
    const pdf = await this.service.fillTemplate(buffer, dto.data);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdf));
  }
}
