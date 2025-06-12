import { MarkdownParser } from '../../src/parsers/markdown';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('基本的なMarkdown解析', () => {
    test('シンプルなMarkdownを解析', () => {
      const markdown = `# タイトル

これはテストです。

## セクション

- リスト項目1
- リスト項目2`;

      const result = parser.parse(markdown);
      
      expect(result.html).toContain('<h1>タイトル</h1>');
      expect(result.html).toContain('<h2>セクション</h2>');
      expect(result.html).toContain('<ul>');
      expect(result.html).toContain('<li>リスト項目1</li>');
      expect(result.diagrams).toHaveLength(0);
    });

    test('コードブロックを解析', () => {
      const markdown = `# テスト

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\``;

      const result = parser.parse(markdown);
      
      expect(result.html).toContain('<pre>');
      expect(result.html).toContain('<code');
      expect(result.html).toContain('function hello()');
    });

    test('テーブルを解析', () => {
      const markdown = `| 名前 | 年齢 |
|------|------|
| 太郎 | 25   |
| 花子 | 30   |`;

      const result = parser.parse(markdown);
      
      expect(result.html).toContain('<table>');
      expect(result.html).toContain('<th>名前</th>');
      expect(result.html).toContain('<td>太郎</td>');
    });
  });

  describe('図表の検出', () => {
    test('Mermaid図表を検出', () => {
      const markdown = `# テスト

\`\`\`mermaid
graph TD
    A[開始] --> B[終了]
\`\`\``;

      const result = parser.parse(markdown);
      
      expect(result.diagrams).toHaveLength(1);
      expect(result.diagrams[0].type).toBe('mermaid');
      expect(result.diagrams[0].source).toContain('graph TD');
      expect(result.html).toContain('class="diagram mermaid-diagram"');
    });

    test('PlantUML図表を検出', () => {
      const markdown = `# テスト

\`\`\`plantuml
@startuml
Alice -> Bob: Hello
@enduml
\`\`\``;

      const result = parser.parse(markdown);
      
      expect(result.diagrams).toHaveLength(1);
      expect(result.diagrams[0].type).toBe('plantuml');
      expect(result.diagrams[0].source).toContain('@startuml');
      expect(result.html).toContain('class="diagram plantuml-diagram"');
    });

    test('複数の図表を検出', () => {
      const markdown = `# テスト

\`\`\`mermaid
graph TD
    A --> B
\`\`\`

\`\`\`plantuml
@startuml
Alice -> Bob
@enduml
\`\`\`

\`\`\`mermaid
pie title テスト
    "A" : 30
    "B" : 70
\`\`\``;

      const result = parser.parse(markdown);
      
      expect(result.diagrams).toHaveLength(3);
      expect(result.diagrams.filter(d => d.type === 'mermaid')).toHaveLength(2);
      expect(result.diagrams.filter(d => d.type === 'plantuml')).toHaveLength(1);
    });

    test('図表でないコードブロックは無視', () => {
      const markdown = `# テスト

\`\`\`javascript
console.log("Hello");
\`\`\`

\`\`\`bash
echo "test"
\`\`\``;

      const result = parser.parse(markdown);
      
      expect(result.diagrams).toHaveLength(0);
    });
  });

  describe('メタデータの抽出', () => {
    test('タイトルを抽出', () => {
      const markdown = `# メインタイトル

内容です。`;

      const result = parser.parse(markdown);
      
      expect(result.metadata.title).toBe('メインタイトル');
    });

    test('タイトルがない場合', () => {
      const markdown = `これはタイトルなしのドキュメントです。`;

      const result = parser.parse(markdown);
      
      expect(result.metadata.title).toBeUndefined();
    });
  });
});