export interface Config {
  pdf: {
    format: 'A4' | 'Letter' | 'Legal';
    margin: string | {
      top: string;
      right: string;
      bottom: string;
      left: string;
    };
    header?: string;
    footer?: string;
  };
  diagrams: {
    mermaid: {
      theme: 'default' | 'dark' | 'forest';
      scale: number;
    };
    plantuml: {
      jarPath?: string;
      timeout: number;
    };
    concurrency?: number; // 並列処理の最大数（デフォルト: 8）
  };
  progress?: {
    enabled: boolean; // プログレスバーの表示有無
    format: string; // プログレスバーの表示形式
  };
}

export interface DiagramBlock {
  id: string;
  source: string;
  type: 'mermaid' | 'plantuml';
  position: number;
}

export interface ParseResult {
  html: string;
  diagrams: DiagramBlock[];
  metadata: {
    title?: string;
    author?: string;
    [key: string]: unknown;
  };
}

export interface ConversionOptions {
  input: string;
  output: string;
  config?: Partial<Config>;
}

export interface ProgressCallback {
  (current: number, total: number, stage: string): void;
}