import puppeteer, { Browser, Page } from 'puppeteer';
import { DiagramBlock, Config } from '../types';

export class MermaidProcessor {
  private config: Config;
  private browser?: Browser;

  constructor(config: Config) {
    this.config = config;
  }

  private async getBrowser(): Promise<Browser> {
    try {
      // ブラウザが既に存在し、接続されているか確認
      if (this.browser && this.browser.isConnected()) {
        return this.browser;
      }
      
      // 既存のブラウザインスタンスをクリーンアップ
      if (this.browser) {
        try {
          await this.browser.close();
        } catch (e) {
          console.warn('Failed to close existing browser:', e);
        }
        this.browser = undefined;
      }
      
      // 新しいブラウザインスタンスを起動
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--single-process'
        ],
        timeout: 30000
      });
      
      // ブラウザプロセスの異常終了を監視
      this.browser.on('disconnected', () => {
        console.warn('Browser disconnected');
        this.browser = undefined;
      });
      
      return this.browser;
    } catch (error) {
      console.error('Failed to launch browser:', error);
      this.browser = undefined;
      throw error;
    }
  }

  public async processMermaidBlock(block: DiagramBlock): Promise<string> {
    if (block.type !== 'mermaid') {
      throw new Error('Invalid block type for Mermaid processor');
    }

    try {
      const browser = await this.getBrowser();
      const page = await browser.newPage();
      
      // ビューポートサイズを設定
      await page.setViewport({ width: 1400, height: 800 });

      try {
        // タイムアウトを設定
        page.setDefaultTimeout(20000);
        page.setDefaultNavigationTimeout(20000);
        
        // Mermaidを含むHTMLページを作成
        const html = this.createMermaidHtml(block.source);
        
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 20000 });
        
        // フォントの読み込み完了を待機
        await page.evaluate(() => {
          return document.fonts.ready;
        });

        // より長い待機時間でMermaidが生成されるのを待つ
        await page.waitForSelector('.mermaid svg', { timeout: 15000 });

        // SVGエレメントを取得
        const svgElement = await page.$('.mermaid svg');
        if (!svgElement) {
          throw new Error('Mermaid diagram not rendered');
        }

        // SVGエレメントの実際のサイズを取得
        const boundingBox = await svgElement.boundingBox();
        if (!boundingBox) {
          throw new Error('Could not get SVG bounding box');
        }

        // サイズ測定のためのスクリーンショット（デバッグ用途のみ）
        const screenshotBuffer = await page.screenshot({
          clip: boundingBox,
          omitBackground: true,
        });

        // SVGの内容を取得し、正確なサイズを設定
        const svgContent = await page.evaluate((width, height) => {
          const svgElement = document.querySelector('.mermaid svg');
          if (!svgElement) {
            throw new Error('SVG element not found');
          }
          
          // 正確なサイズを設定
          svgElement.setAttribute('width', width.toString());
          svgElement.setAttribute('height', height.toString());
          
          // viewBoxがある場合は保持
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }
          
          // max-widthスタイルを削除
          const style = svgElement.getAttribute('style');
          if (style) {
            const newStyle = style.replace(/max-width:[^;]*;?/g, '').trim();
            if (newStyle) {
              svgElement.setAttribute('style', newStyle);
            } else {
              svgElement.removeAttribute('style');
            }
          }
          
          return svgElement.outerHTML;
        }, Math.round(boundingBox.width), Math.round(boundingBox.height));

        // SVGの内容をBase64エンコードしてdata URLとして返す
        const base64Svg = Buffer.from(svgContent).toString('base64');
        
        return `data:image/svg+xml;base64,${base64Svg}`;
      } finally {
        // ページを確実にクローズ
        try {
          await page.close();
        } catch (e) {
          console.warn('Failed to close page:', e);
        }
      }
    } catch (error) {
      console.error(`Failed to process Mermaid diagram ${block.id}:`, error);
      return this.createErrorPlaceholder(block.id, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private createMermaidHtml(source: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <link href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=block" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/mermaid@11.0.0/dist/mermaid.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'BIZ UDPGothic', 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', sans-serif;
        }
        
        * {
            font-family: inherit;
        }
        .mermaid {
            display: inline-block;
            margin: 0 auto;
            text-align: center;
            min-width: 1200px;
        }
        .mermaid svg {
            display: block;
            margin: 0 auto;
            max-width: none !important;
        }
    </style>
</head>
<body>
    <div class="mermaid">
        ${source}
    </div>
    <script>
        mermaid.initialize({
          startOnLoad: true,
          theme: '${this.config.diagrams.mermaid.theme}',
          fontFamily: 'BIZ UDPGothic, Arial, sans-serif',
          flowchart: { 
            useMaxWidth: true,
            htmlLabels: true
          },
          sequence: { useMaxWidth: true },
          gantt: { useMaxWidth: true }
        });
    </script>
</body>
</html>`;
  }

  private createErrorPlaceholder(diagramId: string, errorMessage: string): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffe0e0" stroke="#ff6b6b" stroke-width="2"/>
        <text x="50%" y="30%" text-anchor="middle" font-family="BIZ UDPGothic, Arial" font-size="14" fill="#d63031">
          Mermaid図表エラー (${diagramId})
        </text>
        <text x="50%" y="50%" text-anchor="middle" font-family="BIZ UDPGothic, Arial" font-size="12" fill="#666">
          エラー: ${errorMessage.substring(0, 50)}...
        </text>
        <text x="50%" y="70%" text-anchor="middle" font-family="BIZ UDPGothic, Arial" font-size="10" fill="#999">
          図表の構文を確認してください
        </text>
      </svg>
    `).toString('base64')}`;
  }

  public async cleanup(): Promise<void> {
    try {
      if (this.browser) {
        // すべてのページを取得してクローズ
        const pages = await this.browser.pages();
        await Promise.all(pages.map(page => 
          page.close().catch(e => console.warn('Failed to close page during cleanup:', e))
        ));
        
        // ブラウザをクローズ
        await this.browser.close();
        this.browser = undefined;
      }
    } catch (error) {
      console.warn('Failed to cleanup Mermaid processor:', error);
      // 強制的にブラウザプロセスを終了
      if (this.browser) {
        try {
          const process = this.browser.process();
          if (process) {
            process.kill('SIGKILL');
          }
        } catch (e) {
          console.warn('Failed to kill browser process:', e);
        }
        this.browser = undefined;
      }
    }
  }
}