# md2pdf 設計書

## プロジェクト概要
MarkdownファイルをPDFに変換するツール。Mermaid.jsやPlantUMLの図表も含めて変換可能。

## 技術選定

### プログラミング言語
- **Node.js + TypeScript**
  - Mermaid.jsとの相性が最良
  - 豊富なMarkdown処理ライブラリ
  - PDF生成ライブラリの充実

### 主要ライブラリ
1. **Markdown処理**: `markdown-it`
2. **PDF生成**: `puppeteer`
3. **Mermaid.js**: `mermaid@11.0.0`
4. **PlantUML**: plantuml.jar直接実行
5. **CLI**: `commander.js`

## プロジェクト構造

```
md2pdf/
├── src/
│   ├── parsers/          # Markdown解析・図表処理
│   │   ├── markdown.ts   # 基本Markdown処理
│   │   ├── mermaid.ts    # Mermaid図表処理（SVG出力）
│   │   └── plantuml.ts   # PlantUML図表処理（SVG出力）
│   ├── renderers/        # レンダリング
│   │   ├── html.ts       # HTML生成（BIZ UDPGothicフォント対応）
│   │   └── diagram.ts    # 図表レンダリング統合
│   ├── generators/       # PDF生成
│   │   └── pdf.ts        # HTML→PDF変換
│   ├── cli/             # CLIインターフェース
│   │   └── index.ts     # コマンドライン処理
│   ├── converter.ts     # メインコンバーター
│   └── types.ts         # 型定義
├── plantuml.jar         # PlantUML実行ファイル
├── sample.md           # サンプルMarkdownファイル
├── tests/               # テストコード
│   ├── unit/            # 単体テスト
│   ├── integration/     # 統合テスト
│   ├── __mocks__/       # モックファイル
│   └── utils/           # テストユーティリティ
├── performance-test.md  # 性能テスト用サンプル
└── package.json
```

## 処理フロー

1. **Markdown解析**: `markdown-it`でMarkdownをパース
2. **図表抽出**: Mermaid・PlantUMLのコードブロックを検出
3. **図表変換**: 各図表をSVG形式で並列変換（バッチ処理）
4. **HTML生成**: Markdownと変換した図表を統合してHTML生成
5. **PDF変換**: `puppeteer`でHTML→PDF変換

## 図表処理方式

### Mermaid処理
- **SVG出力**: 高品質で拡縮可能
- **サイズ最適化**: PNG測定→SVG適用のハイブリッド方式
- **フォント対応**: BIZ UDPGothicフォント適用

### PlantUML処理
- **Java実行**: `java -jar plantuml.jar -tsvg`
- **SVG出力**: ベクター形式で高品質
- **UTF-8対応**: 日本語文字化け防止

## フォント設計

### 日本語フォント
- **メインフォント**: BIZ UDPGothic（ユニバーサルデザイン）
- **フォールバック**: Noto Sans JP, Hiragino Sans, Yu Gothic, Meiryo
- **統一性**: 本文・Mermaid図表で同一フォント使用

### フォント読み込み戦略
- Google Fonts + ローカルインストール併用
- `document.fonts.ready`での確実な待機
- `font-display: block`で優先読み込み

## CLI設計

### 基本コマンド
```bash
# 基本使用法
npm run dev sample.md
node dist/cli/index.js sample.md

# オプション指定
npm run dev -- sample.md --mermaid-theme dark -f A4 -m 25mm
```

### 利用可能オプション
- `-o, --output <file>`: 出力PDFファイル名
- `-f, --format <format>`: PDFフォーマット (A4, Letter, Legal)
- `-m, --margin <margin>`: ページマージン
- `--header <text>`: ページヘッダー
- `--footer <text>`: ページフッター
- `--mermaid-theme <theme>`: Mermaidテーマ (default, dark, forest)
- `--plantuml-jar <path>`: PlantUMLのjarファイルパス
- `-c, --concurrency <number>`: 図表処理の並列数 (デフォルト: 8)

## 設定管理

```typescript
interface Config {
  pdf: {
    format: 'A4' | 'Letter' | 'Legal';
    margin: string;
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
    concurrency?: number; // 図表処理の並列数（デフォルト: 8）
  };
}
```

## 実装のポイント

### 高品質な図表レンダリング
- Mermaid: SVG形式でテキストがクリア
- PlantUML: Java直接実行で最新機能対応
- サイズ最適化: 自動サイズ検出機能

### 日本語対応
- UTF-8エンコーディング統一
- 美しい日本語フォント（BIZ UDPGothic）
- 文字化け防止対策

### 開発者体験
- TypeScript完全対応
- 豊富なCLIオプション
- エラーハンドリング充実
- デバッグ機能（開発時のみ）

## パフォーマンス

### 最適化ポイント
- フォント事前読み込み
- **図表の並列処理**: バッチ処理による制御可能な並列実行
- 一時ファイルの自動クリーンアップ
- Puppeteerブラウザインスタンス再利用とリカバリー処理

### 並列処理設計
- **バッチ処理**: 指定された並列数でバッチに分割して処理
- **リソース制御**: 同時実行数を制限してシステム負荷を調整
- **エラー分離**: 個別図表のエラーが他に影響しない設計
- **タイムアウト対策**: Puppeteerの接続監視と自動回復

### メモリ効率
- ストリーミング処理対応可能な設計
- 大容量ファイル処理への配慮
- リソースの確実な解放
- 並列数調整によるメモリ使用量制御

## テスト設計

### テスト構成
- **Jest**: TypeScript対応テストフレームワーク
- **単体テスト**: 各モジュールの機能テスト
- **統合テスト**: エンドツーエンドの変換処理テスト
- **モック**: Puppeteer、外部プロセスの模擬実装

### テストカバレッジ
- **設定管理**: Config型のマージとバリデーション
- **Markdown処理**: 基本要素と図表検出
- **並列処理**: バッチ処理とエラーハンドリング
- **図表変換**: MermaidとPlantUMLの処理

### 性能テスト
- **performance-test.md**: 20個の多様な図表を含むサンプル
- **並列数比較**: 4個、8個、20個での処理時間測定
- **リソース監視**: メモリ使用量とCPU負荷の確認