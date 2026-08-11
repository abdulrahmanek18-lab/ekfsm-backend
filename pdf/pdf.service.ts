import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';

@Injectable()
export class PdfService {
  async generateFromHtml(html: string, options?: { width?: string; height?: string }) {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
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

  async generateInvoicePdf(invoice: any, company: any) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .company { font-size: 24px; font-weight: bold; }
          .trn { color: #666; font-size: 12px; }
          .invoice-title { font-size: 20px; color: #333; margin-top: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; }
          .totals { margin-top: 30px; text-align: right; }
          .total-row { font-size: 16px; margin: 5px 0; }
          .grand-total { font-size: 20px; font-weight: bold; color: #333; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">${company.name}</div>
          <div class="trn">TRN: ${company.trn || 'N/A'}</div>
          <div class="invoice-title">TAX INVOICE - ${invoice.invoiceNo}</div>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <div>
            <strong>Bill To:</strong><br>
            ${invoice.customer.name}<br>
            ${invoice.customer.address || ''}<br>
            ${invoice.customer.phone || ''}
          </div>
          <div style="text-align: right;">
            <strong>Invoice Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}<br>
            <strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}<br>
            <strong>Status:</strong> ${invoice.status}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>VAT %</th>
              <th>VAT Amount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.lineItems.map((item: any) => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>AED ${item.unitPrice}</td>
                <td>${item.vatPercent}%</td>
                <td>AED ${item.vatAmount}</td>
                <td>AED ${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">Subtotal: AED ${invoice.subTotal}</div>
          <div class="total-row">VAT (${invoice.vatPercent}%): AED ${invoice.vatAmount}</div>
          <div class="grand-total">Total: AED ${invoice.totalAmount}</div>
        </div>

        <div class="footer">
          ${company.footerText || 'Thank you for your business'}
        </div>
      </body>
      </html>
    `;
    return this.generateFromHtml(html);
  }
}
