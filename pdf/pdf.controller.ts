import { Controller, Post, Body } from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly service: PdfService) {}

  @Post('generate')
  async generatePdf(@Body() dto: any) {
    // This will now successfully call the function we added to pdf.service.ts
    const pdf = await this.service.generateFromHtml(dto.html);
    return { success: true, pdf: pdf.toString('base64') };
  }
}
