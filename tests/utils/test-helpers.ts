import * as path from 'path';
import { DiagramBlock } from '../../src/types';

/**
 * テスト用のヘルパー関数
 */

/**
 * テスト用のMarkdownコンテンツを生成
 */
export function createTestMarkdown(options: {
  title?: string;
  content?: string;
  mermaidDiagrams?: string[];
  plantumlDiagrams?: string[];
}): string {
  const { title = 'テストドキュメント', content = 'テスト内容', mermaidDiagrams = [], plantumlDiagrams = [] } = options;

  let markdown = `# ${title}\n\n${content}\n\n`;

  mermaidDiagrams.forEach((diagram, index) => {
    markdown += `## Mermaid図表 ${index + 1}\n\n\`\`\`mermaid\n${diagram}\n\`\`\`\n\n`;
  });

  plantumlDiagrams.forEach((diagram, index) => {
    markdown += `## PlantUML図表 ${index + 1}\n\n\`\`\`plantuml\n${diagram}\n\`\`\`\n\n`;
  });

  return markdown;
}

/**
 * テスト用のDiagramBlockを生成
 */
export function createTestDiagramBlock(
  id: string,
  type: 'mermaid' | 'plantuml',
  source: string,
  position: number = 0
): DiagramBlock {
  return {
    id,
    type,
    source,
    position,
  };
}

/**
 * テスト用のMermaid図表ソースを生成
 */
export function createMermaidSource(type: 'flowchart' | 'sequence' | 'gantt' | 'pie' = 'flowchart'): string {
  switch (type) {
    case 'flowchart':
      return 'graph TD\n    A[開始] --> B[終了]';
    case 'sequence':
      return 'sequenceDiagram\n    participant A\n    participant B\n    A->>B: メッセージ';
    case 'gantt':
      return 'gantt\n    title テストガント\n    dateFormat YYYY-MM-DD\n    section テスト\n    タスク1 :2024-01-01, 3d';
    case 'pie':
      return 'pie title テストパイ\n    "A" : 30\n    "B" : 70';
    default:
      return 'graph TD\n    A --> B';
  }
}

/**
 * テスト用のPlantUML図表ソースを生成
 */
export function createPlantUMLSource(type: 'sequence' | 'usecase' | 'class' | 'activity' = 'sequence'): string {
  switch (type) {
    case 'sequence':
      return '@startuml\nAlice -> Bob: Hello\n@enduml';
    case 'usecase':
      return '@startuml\nactor User\nUser --> (Login)\n@enduml';
    case 'class':
      return '@startuml\nclass TestClass {\n  +method()\n}\n@enduml';
    case 'activity':
      return '@startuml\nstart\n:Activity;\nstop\n@enduml';
    default:
      return '@startuml\nAlice -> Bob: Test\n@enduml';
  }
}

/**
 * テスト用の一意なファイルパスを生成
 */
export function createTestFilePath(baseName: string, extension: string = '.md'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return path.join(__dirname, '../output', `${baseName}-${timestamp}-${random}${extension}`);
}

/**
 * 非同期関数の実行時間を測定
 */
export async function measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
  const start = Date.now();
  const result = await fn();
  const duration = Date.now() - start;
  return { result, duration };
}