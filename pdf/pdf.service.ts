import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class PdfService {
  // Puppeteer was removed to prevent Render memory crashes.

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
