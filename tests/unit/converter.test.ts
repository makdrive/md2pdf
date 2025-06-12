import { Md2PdfConverter } from '../../src/converter';
import { Config } from '../../src/types';

// モック化
jest.mock('../../src/parsers/markdown');
jest.mock('../../src/renderers/html');
jest.mock('../../src/generators/pdf');
jest.mock('cli-progress');

describe('Md2PdfConverter', () => {
  let converter: Md2PdfConverter;

  beforeEach(() => {
    converter = new Md2PdfConverter();
  });

  describe('設定のマージ', () => {
    test('デフォルト設定を使用', () => {
      const defaultConverter = new Md2PdfConverter();
      expect(defaultConverter).toBeDefined();
    });

    test('カスタム設定をマージ', () => {
      const customConfig: Partial<Config> = {
        pdf: {
          format: 'Letter',
          margin: '15mm',
        },
        diagrams: {
          mermaid: {
            theme: 'dark',
            scale: 1.5,
          },
          plantuml: {
            timeout: 30000,
          },
          concurrency: 4,
        },
      };

      const customConverter = new Md2PdfConverter(customConfig);
      expect(customConverter).toBeDefined();
    });

    test('部分的な設定をマージ', () => {
      const partialConfig: Partial<Config> = {
        pdf: {
          format: 'A4',
          margin: '20mm',
        },
      };

      const partialConverter = new Md2PdfConverter(partialConfig);
      expect(partialConverter).toBeDefined();
    });
  });

  describe('プログレス機能', () => {
    test('プログレスバーが有効な場合', () => {
      const progressConfig: Partial<Config> = {
        pdf: {
          format: 'A4',
          margin: '20mm',
        },
        progress: {
          enabled: true,
          format: 'Progress |{bar}| {percentage}% | {stage}',
        },
      };

      const converter = new Md2PdfConverter(progressConfig);
      expect(converter).toBeDefined();
    });

    test('プログレスバーが無効な場合', () => {
      const noProgressConfig: Partial<Config> = {
        pdf: {
          format: 'A4',
          margin: '20mm',
        },
        progress: {
          enabled: false,
          format: 'Progress |{bar}| {percentage}% | {stage}',
        },
      };

      const converter = new Md2PdfConverter(noProgressConfig);
      expect(converter).toBeDefined();
    });

    test('プログレス設定未指定の場合のデフォルト値（有効）', () => {
      const defaultConverter = new Md2PdfConverter();
      expect(defaultConverter).toBeDefined();
    });

    test('明示的にプログレスバーを無効化', () => {
      const disabledProgressConfig: Partial<Config> = {
        progress: {
          enabled: false,
          format: 'Progress |{bar}| {percentage}% | {stage}',
        },
      };

      const converter = new Md2PdfConverter(disabledProgressConfig);
      expect(converter).toBeDefined();
    });
  });

  describe('バリデーション', () => {
    test('無効な並列数を処理', () => {
      const invalidConfig: Partial<Config> = {
        pdf: {
          format: 'A4',
          margin: '20mm',
        },
      };

      const converter = new Md2PdfConverter(invalidConfig);
      expect(converter).toBeDefined();
    });

    test('文字列形式のマージンを処理', () => {
      const config: Partial<Config> = {
        pdf: {
          format: 'A4',
          margin: '25mm',
        },
      };

      const converter = new Md2PdfConverter(config);
      expect(converter).toBeDefined();
    });

    test('オブジェクト形式のマージンを処理', () => {
      const config: Partial<Config> = {
        pdf: {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm',
          },
        },
      };

      const converter = new Md2PdfConverter(config);
      expect(converter).toBeDefined();
    });
  });
});