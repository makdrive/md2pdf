import MarkdownIt from 'markdown-it';
import { DiagramBlock, ParseResult } from '../types';

export class MarkdownParser {
  private md: MarkdownIt;

  constructor() {
    this.md = new MarkdownIt({
      html: true,
      breaks: true,
      linkify: true,
    });
  }

  public parse(content: string): ParseResult {
    const diagrams: DiagramBlock[] = [];
    let diagramCounter = 0;

    // Mermaidブロックを検出・抽出
    const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
    content = content.replace(mermaidRegex, (match, source) => {
      const id = `mermaid-${diagramCounter++}`;
      diagrams.push({
        id,
        source: source.trim(),
        type: 'mermaid',
        position: diagrams.length,
      });
      return `<div id="${id}" class="diagram mermaid-diagram"></div>`;
    });

    // PlantUMLブロックを検出・抽出
    const plantumlRegex = /```plantuml\n([\s\S]*?)\n```/g;
    content = content.replace(plantumlRegex, (match, source) => {
      const id = `plantuml-${diagramCounter++}`;
      diagrams.push({
        id,
        source: source.trim(),
        type: 'plantuml',
        position: diagrams.length,
      });
      return `<div id="${id}" class="diagram plantuml-diagram"></div>`;
    });

    // メタデータを抽出（YAML Front Matter風）
    const metadata = this.extractMetadata(content);

    // MarkdownをHTMLに変換
    const html = this.md.render(content);

    return {
      html,
      diagrams,
      metadata,
    };
  }

  private extractMetadata(content: string): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};
    
    // 簡単なメタデータ抽出（タイトルなど）
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1];
    }

    return metadata;
  }
}