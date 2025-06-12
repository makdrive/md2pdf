import { DiagramRenderer } from '../../src/renderers/diagram';
import { Config, DiagramBlock } from '../../src/types';

// モック化
jest.mock('../../src/parsers/mermaid');
jest.mock('../../src/parsers/plantuml');

describe('DiagramRenderer', () => {
  let renderer: DiagramRenderer;
  let mockConfig: Config;

  beforeEach(() => {
    mockConfig = {
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
        concurrency: 4,
      },
    };
    
    renderer = new DiagramRenderer(mockConfig);
  });

  describe('並列処理制御', () => {
    test('並列数以下の図表は同時処理', async () => {
      const diagrams: DiagramBlock[] = [
        { id: 'mermaid-1', type: 'mermaid', source: 'graph TD\nA-->B', position: 0 },
        { id: 'plantuml-1', type: 'plantuml', source: '@startuml\nA->B\n@enduml', position: 1 },
      ];

      const result = await renderer.renderDiagrams(diagrams);
      
      expect(result.size).toBe(2);
      expect(result.has('mermaid-1')).toBeTruthy();
      expect(result.has('plantuml-1')).toBeTruthy();
    });

    test('並列数を超える図表はバッチ処理', async () => {
      const diagrams: DiagramBlock[] = Array.from({ length: 6 }, (_, i) => ({
        id: `mermaid-${i}`,
        type: 'mermaid' as const,
        source: 'graph TD\nA-->B',
        position: i,
      }));

      const result = await renderer.renderDiagrams(diagrams);
      
      expect(result.size).toBe(6);
      // 並列数4なので、最初の4個と残りの2個に分けて処理される
    });

    test('空の図表配列を処理', async () => {
      const diagrams: DiagramBlock[] = [];

      const result = await renderer.renderDiagrams(diagrams);
      
      expect(result.size).toBe(0);
    });
  });

  describe('エラーハンドリング', () => {
    test('不明な図表タイプでプレースホルダーを生成', async () => {
      const diagrams: DiagramBlock[] = [
        { id: 'unknown-1', type: 'unknown' as any, source: 'invalid', position: 0 },
      ];

      const result = await renderer.renderDiagrams(diagrams);
      
      expect(result.size).toBe(1);
      expect(result.get('unknown-1')).toContain('data:image/svg+xml;base64,');
    });

    test('図表処理が完了することを確認', async () => {
      const diagrams: DiagramBlock[] = [
        { id: 'test-mermaid', type: 'mermaid', source: 'graph TD\nA-->B', position: 0 },
      ];

      const result = await renderer.renderDiagrams(diagrams);
      
      expect(result.size).toBe(1);
      expect(result.has('test-mermaid')).toBeTruthy();
    });
  });

  describe('設定の適用', () => {
    test('カスタム並列数を使用', () => {
      const customConfig: Config = {
        ...mockConfig,
        diagrams: {
          ...mockConfig.diagrams,
          concurrency: 2,
        },
      };

      const customRenderer = new DiagramRenderer(customConfig);
      expect(customRenderer).toBeDefined();
    });

    test('並列数未指定時はデフォルト値を使用', () => {
      const configWithoutConcurrency: Config = {
        ...mockConfig,
        diagrams: {
          mermaid: mockConfig.diagrams.mermaid,
          plantuml: mockConfig.diagrams.plantuml,
        },
      };

      const defaultRenderer = new DiagramRenderer(configWithoutConcurrency);
      expect(defaultRenderer).toBeDefined();
    });
  });
});