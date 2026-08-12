import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class PdfService {
  async generateFromHtml(html: string, options?: { width?: string; height?: string }) {
    // Changed 'new' to true to fix TypeScript error
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });
    await browser.close();
    return pdf;
  }

  async fillTemplate(templateBuffer: Buffer, data: Record<string, string>) {
    const pdfDoc = await PDFDocument.load(templateBuffer);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    for (const field of fields) {
      const name = field.getName();
      if (data[name] !== undefined) {
        try {
          if (field.constructor.name === 'PDFTextField') {
            (field as any).setText(data[name]);
          } else if (field.constructor.name === 'PDFCheckBox') {
            if (data[name] === 'true' || data[name] === 'yes') {
              (field as any).check();
            }
          }
        } catch (e) {
          console.warn(`Could not fill field ${name}:`, e.message);
        }
      }
    }

    form.flatten();
    return pdfDoc.save();
  }
}
