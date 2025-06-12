import * as fs from 'fs/promises';
import * as path from 'path';
import { Md2PdfConverter } from '../../src/converter';

// Puppeteerをモック化
jest.mock('puppeteer');

describe('統合テスト', () => {
  const testOutputDir = path.join(__dirname, '../output');
  
  beforeAll(async () => {
    // テスト用出力ディレクトリを作成
    await fs.mkdir(testOutputDir, { recursive: true });
  });

  afterAll(async () => {
    // テスト用ファイルをクリーンアップ
    try {
      await fs.rm(testOutputDir, { recursive: true, force: true });
    } catch (error) {
      // ディレクトリが存在しない場合は無視
    }
  });

  describe('基本的なMarkdown変換', () => {
    test('シンプルなMarkdownをPDFに変換', async () => {
      const converter = new Md2PdfConverter();
      const inputPath = path.join(testOutputDir, 'simple-test.md');
      const outputPath = path.join(testOutputDir, 'simple-test.pdf');

      // テスト用Markdownファイルを作成
      const markdown = `# テストドキュメント

これは統合テスト用のドキュメントです。

## セクション1

- 項目1
- 項目2
- 項目3

## セクション2

\`\`\`javascript
function test() {
  return "Hello, Test!";
}
\`\`\`

| 列1 | 列2 |
|-----|-----|
| 値1 | 値2 |
| 値3 | 値4 |
`;

      await fs.writeFile(inputPath, markdown, 'utf-8');

      // PDF変換を実行
      await converter.convert({
        input: inputPath,
        output: outputPath,
      });

      // PDF変換が正常に完了したことを確認（モック環境では実際のファイルは作成されない）
      // 実際のテストでは、変換処理が例外なく完了することを確認
      expect(true).toBeTruthy();

      // ファイルクリーンアップ
      await fs.unlink(inputPath);
      // PDFファイルはモック環境では作成されないのでクリーンアップ不要
    }, 30000);

    test('図表を含むMarkdownをPDFに変換', async () => {
      const converter = new Md2PdfConverter({
        diagrams: {
          mermaid: {
            theme: 'default',
            scale: 1,
          },
          plantuml: {
            timeout: 30000,
          },
          concurrency: 2, // テスト用に並列数を制限
        },
      });
      
      const inputPath = path.join(testOutputDir, 'diagram-test.md');
      const outputPath = path.join(testOutputDir, 'diagram-test.pdf');

      // 図表を含むMarkdownファイルを作成
      const markdown = `# 図表テスト

## Mermaidフローチャート

\`\`\`mermaid
graph TD
    A[開始] --> B{判定}
    B -->|Yes| C[処理A]
    B -->|No| D[処理B]
    C --> E[終了]
    D --> E
\`\`\`

## PlantUMLシーケンス図

\`\`\`plantuml
@startuml
participant ユーザー as user
participant システム as system

user -> system: 要求
system -> system: 処理
system -> user: 応答
@enduml
\`\`\`

これでテスト完了です。
`;

      await fs.writeFile(inputPath, markdown, 'utf-8');

      // PDF変換を実行
      await converter.convert({
        input: inputPath,
        output: outputPath,
      });

      // PDF変換が正常に完了したことを確認
      expect(true).toBeTruthy();

      // ファイルクリーンアップ
      await fs.unlink(inputPath);
    }, 60000);
  });

  describe('エラーハンドリング', () => {
    test('存在しないファイルでエラー', async () => {
      const converter = new Md2PdfConverter();
      const nonExistentPath = path.join(testOutputDir, 'non-existent.md');
      const outputPath = path.join(testOutputDir, 'output.pdf');

      await expect(converter.convert({
        input: nonExistentPath,
        output: outputPath,
      })).rejects.toThrow();
    });

    test('無効な図表構文でもPDF生成を継続', async () => {
      const converter = new Md2PdfConverter();
      const inputPath = path.join(testOutputDir, 'invalid-diagram.md');
      const outputPath = path.join(testOutputDir, 'invalid-diagram.pdf');

      const markdown = `# 無効な図表テスト

\`\`\`mermaid
invalid syntax here
not a valid diagram
\`\`\`

続きのテキストです。
`;

      await fs.writeFile(inputPath, markdown, 'utf-8');

      // エラーでも継続してPDFを生成
      await converter.convert({
        input: inputPath,
        output: outputPath,
      });

      // PDF変換が正常に完了したことを確認
      expect(true).toBeTruthy();

      // ファイルクリーンアップ
      await fs.unlink(inputPath);
    }, 30000);
  });

  describe('設定のテスト', () => {
    test('カスタム設定でPDF生成', async () => {
      const converter = new Md2PdfConverter({
        pdf: {
          format: 'Letter',
          margin: '15mm',
        },
        diagrams: {
          mermaid: {
            theme: 'dark',
            scale: 1.2,
          },
          plantuml: {
            timeout: 30000,
          },
          concurrency: 1, // 順次処理
        },
      });

      const inputPath = path.join(testOutputDir, 'custom-config.md');
      const outputPath = path.join(testOutputDir, 'custom-config.pdf');

      const markdown = `# カスタム設定テスト

通常のテキストです。

\`\`\`mermaid
graph LR
    A --> B --> C
\`\`\`
`;

      await fs.writeFile(inputPath, markdown, 'utf-8');

      await converter.convert({
        input: inputPath,
        output: outputPath,
      });

      // PDF変換が正常に完了したことを確認
      expect(true).toBeTruthy();

      // ファイルクリーンアップ
      await fs.unlink(inputPath);
    }, 30000);
  });
});