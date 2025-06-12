import * as fs from 'fs/promises';
import * as path from 'path';
import * as cliProgress from 'cli-progress';
import { MarkdownParser } from './parsers/markdown';
import { HtmlRenderer } from './renderers/html';
import { PdfGenerator } from './generators/pdf';
import { Config, ConversionOptions, ProgressCallback } from './types';

export class Md2PdfConverter {
  private config: Config;
  private markdownParser: MarkdownParser;
  private htmlRenderer: HtmlRenderer;
  private pdfGenerator: PdfGenerator;
  private progressBar: cliProgress.SingleBar | null = null;

  constructor(config?: Partial<Config>) {
    this.config = this.mergeWithDefaultConfig(config || {});
    this.markdownParser = new MarkdownParser();
    this.htmlRenderer = new HtmlRenderer(this.config);
    this.pdfGenerator = new PdfGenerator(this.config);
  }

  public async convert(options: ConversionOptions): Promise<void> {
    const totalSteps = 5;
    let currentStep = 0;

    try {
      // プログレスバーを初期化
      this.initializeProgressBar();
      this.updateProgress(currentStep, totalSteps, 'Starting conversion...');

      // 入力ファイルを読み込み
      const markdownContent = await fs.readFile(options.input, 'utf-8');
      this.updateProgress(++currentStep, totalSteps, 'Reading input file...');
      
      // Markdownを解析
      const parseResult = this.markdownParser.parse(markdownContent);
      this.updateProgress(++currentStep, totalSteps, 'Parsing markdown...');
      
      // HTMLを生成（図表処理を含む）
      const html = await this.htmlRenderer.render(parseResult, (current, total, stage) => {
        // 図表処理の進捗を全体進捗に反映（ステップ3で図表処理を行う）
        const diagramProgressRatio = total > 0 ? current / total : 1;
        const overallProgress = (currentStep + diagramProgressRatio) / totalSteps;
        const percentage = Math.round(overallProgress * 100);
        
        if (this.progressBar) {
          this.progressBar.update(percentage, { stage: `${stage} (${current}/${total})` });
        }
      });
      this.updateProgress(++currentStep, totalSteps, 'Generating HTML...');
      
      // PDF生成器を初期化
      await this.pdfGenerator.initialize();
      this.updateProgress(++currentStep, totalSteps, 'Initializing PDF generator...');
      
      // 出力ディレクトリを作成（存在しない場合）
      const outputDir = path.dirname(options.output);
      await fs.mkdir(outputDir, { recursive: true });
      
      // PDFを生成
      await this.pdfGenerator.generatePdf(html, options.output);
      this.updateProgress(++currentStep, totalSteps, 'Generating PDF...');
      
      this.finishProgress();
      console.log(`PDF generated successfully: ${options.output}`);
      
    } catch (error) {
      this.stopProgress();
      console.error('Conversion failed:', error);
      throw error;
    } finally {
      // 必ずクリーンアップを実行
      try {
        await this.htmlRenderer.cleanup();
      } catch (cleanupError) {
        console.warn('Failed to cleanup HTML renderer:', cleanupError);
      }
      
      try {
        await this.pdfGenerator.close();
      } catch (cleanupError) {
        console.warn('Failed to cleanup PDF generator:', cleanupError);
      }
    }
  }

  private initializeProgressBar(): void {
    if (this.config.progress?.enabled) {
      this.progressBar = new cliProgress.SingleBar({
        format: this.config.progress.format || 'Progress |{bar}| {percentage}% | {stage}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      });
      this.progressBar.start(100, 0);
    }
  }

  private updateProgress(current: number, total: number, stage: string): void {
    if (this.progressBar) {
      const percentage = Math.round((current / total) * 100);
      this.progressBar.update(percentage, { stage });
    }
  }

  private finishProgress(): void {
    if (this.progressBar) {
      this.progressBar.update(100, { stage: 'Completed!' });
      this.progressBar.stop();
      this.progressBar = null;
    }
  }

  private stopProgress(): void {
    if (this.progressBar) {
      this.progressBar.stop();
      this.progressBar = null;
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
        concurrency: 8,
      },
      progress: {
        enabled: true,
        format: 'Progress |{bar}| {percentage}% | {stage}',
      },
    };

    return {
      pdf: { ...defaultConfig.pdf, ...userConfig.pdf },
      diagrams: {
        mermaid: { ...defaultConfig.diagrams.mermaid, ...userConfig.diagrams?.mermaid },
        plantuml: { ...defaultConfig.diagrams.plantuml, ...userConfig.diagrams?.plantuml },
        concurrency: userConfig.diagrams?.concurrency ?? defaultConfig.diagrams.concurrency,
      },
      progress: {
        enabled: userConfig.progress?.enabled ?? defaultConfig.progress!.enabled,
        format: userConfig.progress?.format ?? defaultConfig.progress!.format,
      },
    };
  }
}