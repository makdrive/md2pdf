import * as fs from 'fs/promises';
import * as path from 'path';
import { MarkdownParser } from './parsers/markdown';
import { HtmlRenderer } from './renderers/html';
import { PdfGenerator } from './generators/pdf';
import { Config, ConversionOptions } from './types';

export class Md2PdfConverter {
  private config: Config;
  private markdownParser: MarkdownParser;
  private htmlRenderer: HtmlRenderer;
  private pdfGenerator: PdfGenerator;

  constructor(config?: Partial<Config>) {
    this.config = this.mergeWithDefaultConfig(config || {});
    this.markdownParser = new MarkdownParser();
    this.htmlRenderer = new HtmlRenderer(this.config);
    this.pdfGenerator = new PdfGenerator(this.config);
  }

  public async convert(options: ConversionOptions): Promise<void> {
    try {
      // 入力ファイルを読み込み
      const markdownContent = await fs.readFile(options.input, 'utf-8');
      
      // Markdownを解析
      const parseResult = this.markdownParser.parse(markdownContent);
      
      // HTMLを生成（図表処理を含む）
      const html = await this.htmlRenderer.render(parseResult);
      
      // PDF生成器を初期化
      await this.pdfGenerator.initialize();
      
      // 出力ディレクトリを作成（存在しない場合）
      const outputDir = path.dirname(options.output);
      await fs.mkdir(outputDir, { recursive: true });
      
      // PDFを生成
      await this.pdfGenerator.generatePdf(html, options.output);
      
      console.log(`PDF generated successfully: ${options.output}`);
      
      // PDFが生成された後にクリーンアップ
      await this.htmlRenderer.cleanup();
    } catch (error) {
      console.error('Conversion failed:', error);
      throw error;
    } finally {
      // PDF生成器のクリーンアップ
      await this.pdfGenerator.close();
    }
  }

  private mergeWithDefaultConfig(userConfig: Partial<Config>): Config {
    const defaultConfig: Config = {
      pdf: {
        format: 'A4',
        margin: '20mm',
      },
      diagrams: {
        mermaid: {
          theme: 'default',
          scale: 1,
        },
        plantuml: {
          timeout: 30000,
        },
      },
    };

    return {
      pdf: { ...defaultConfig.pdf, ...userConfig.pdf },
      diagrams: {
        mermaid: { ...defaultConfig.diagrams.mermaid, ...userConfig.diagrams?.mermaid },
        plantuml: { ...defaultConfig.diagrams.plantuml, ...userConfig.diagrams?.plantuml },
      },
    };
  }
}