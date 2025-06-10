import puppeteer, { Browser, Page } from 'puppeteer';
import { Config } from '../types';

export class PdfGenerator {
  private config: Config;
  private browser?: Browser;

  constructor(config: Config) {
    this.config = config;
  }

  public async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  public async generatePdf(html: string, outputPath: string): Promise<void> {
    if (!this.browser) {
      throw new Error('PDF generator not initialized. Call initialize() first.');
    }

    const page: Page = await this.browser.newPage();
    
    try {
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });
      
      // フォントの読み込み完了を待機
      await page.evaluate(() => {
        return document.fonts.ready;
      });

      const margin = this.getMarginConfig();
      
      await page.pdf({
        path: outputPath,
        format: this.config.pdf.format,
        margin,
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: !!(this.config.pdf.header || this.config.pdf.footer),
        headerTemplate: this.config.pdf.header ? `
          <div style="font-size: 10px; width: 100%; text-align: center; margin: 0 auto;">
            ${this.config.pdf.header}
          </div>
        ` : '',
        footerTemplate: this.config.pdf.footer ? `
          <div style="font-size: 10px; width: 100%; text-align: center; margin: 0 auto;">
            ${this.config.pdf.footer}
          </div>
        ` : '',
      });
    } finally {
      await page.close();
    }
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = undefined;
    }
  }

  private getMarginConfig() {
    const { margin } = this.config.pdf;
    
    if (typeof margin === 'string') {
      return {
        top: margin,
        right: margin,
        bottom: margin,
        left: margin,
      };
    }
    
    return margin;
  }
}