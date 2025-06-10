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