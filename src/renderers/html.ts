import { ParseResult, Config } from '../types';
import { DiagramRenderer } from './diagram';

export class HtmlRenderer {
  private config: Config;
  private diagramRenderer: DiagramRenderer;

  constructor(config: Config) {
    this.config = config;
    this.diagramRenderer = new DiagramRenderer(config);
  }

  public async render(parseResult: ParseResult): Promise<string> {
    const { html, diagrams, metadata } = parseResult;
    const title = metadata.title || 'Document';

    // 図表を処理
    const renderedDiagrams = await this.diagramRenderer.renderDiagrams(diagrams);
    
    // HTML内の図表プレースホルダーを実際の画像に置換
    let processedHtml = html;
    
    for (const [diagramId, imagePath] of renderedDiagrams) {
      const placeholder = `<div id="${diagramId}" class="diagram ${diagramId.startsWith('mermaid') ? 'mermaid-diagram' : 'plantuml-diagram'}"></div>`;
      const imageTag = `<div id="${diagramId}" class="diagram ${diagramId.startsWith('mermaid') ? 'mermaid-diagram' : 'plantuml-diagram'}">
        <img src="${imagePath}" alt="${diagramId}" style="max-width: 100%; height: auto;" />
      </div>`;
      
      processedHtml = processedHtml.replace(placeholder, imageTag);
    }

    return `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=block" rel="stylesheet">
    <style>
        ${this.getBaseStyles()}
    </style>
</head>
<body>
    <article class="markdown-body">
        ${processedHtml}
    </article>
</body>
</html>`;
  }

  private getBaseStyles(): string {
    return `
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'BIZ UDPGothic', 'Noto Sans JP', 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #24292f;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        
        * {
            font-family: inherit;
        }
        
        .markdown-body {
            max-width: 980px;
            margin: 0 auto;
            padding: 45px;
        }
        
        .markdown-body h1 {
            font-size: 2em;
            font-weight: 600;
            margin-bottom: 16px;
            line-height: 1.25;
            border-bottom: 1px solid #d0d7de;
            padding-bottom: 0.3em;
        }
        
        .markdown-body h2 {
            font-size: 1.5em;
            font-weight: 600;
            margin-bottom: 16px;
            line-height: 1.25;
            border-bottom: 1px solid #d0d7de;
            padding-bottom: 0.3em;
        }
        
        .markdown-body h3 {
            font-size: 1.25em;
            font-weight: 600;
            margin-bottom: 16px;
            line-height: 1.25;
        }
        
        .markdown-body p {
            margin-bottom: 16px;
        }
        
        .markdown-body code {
            padding: 0.2em 0.4em;
            margin: 0;
            font-size: 85%;
            background-color: rgba(175, 184, 193, 0.2);
            border-radius: 6px;
            font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
        }
        
        .markdown-body pre {
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            background-color: #f6f8fa;
            border-radius: 6px;
            margin-bottom: 16px;
        }
        
        .markdown-body pre code {
            display: inline;
            max-width: auto;
            padding: 0;
            margin: 0;
            overflow: visible;
            line-height: inherit;
            word-wrap: normal;
            background-color: transparent;
            border: 0;
        }
        
        .markdown-body blockquote {
            padding: 0 1em;
            color: #656d76;
            border-left: 0.25em solid #d0d7de;
            margin: 0 0 16px 0;
        }
        
        .markdown-body ul, .markdown-body ol {
            padding-left: 2em;
            margin-bottom: 16px;
        }
        
        .markdown-body li {
            margin-bottom: 0.25em;
        }
        
        .markdown-body table {
            border-spacing: 0;
            border-collapse: collapse;
            margin-bottom: 16px;
            width: 100%;
        }
        
        .markdown-body th, .markdown-body td {
            padding: 6px 13px;
            border: 1px solid #d0d7de;
        }
        
        .markdown-body th {
            font-weight: 600;
            background-color: #f6f8fa;
        }
        
        .diagram {
            text-align: center;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .diagram img {
            max-width: 100%;
            height: auto;
        }
        
        @media print {
            body {
                font-size: 12pt;
            }
            
            .markdown-body {
                padding: 0;
                max-width: none;
            }
            
            .markdown-body h1, .markdown-body h2 {
                page-break-after: avoid;
            }
            
            .diagram {
                page-break-inside: avoid;
            }
        }
    `;
  }

  public async cleanup(): Promise<void> {
    await this.diagramRenderer.cleanup();
  }
}