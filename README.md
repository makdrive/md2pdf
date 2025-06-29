# md2pdf

**MarkdownファイルをPDFに変換するCLIツール**
Mermaid図表とPlantUML図表に対応し、美しい日本語フォントでプロフェッショナルなPDFを生成します。

## ✨ 特徴

- 📄 **Markdown → PDF変換**: 標準的なMarkdown要素を完全サポート
- 📊 **図表対応**: Mermaid・PlantUML図表をSVG形式で高品質出力
- 🎨 **美しい日本語**: BIZ UDPGothicフォントで読みやすい文書
- ⚙️ **豊富なオプション**: PDFフォーマット、マージン、テーマなど
- 🚀 **高速処理**: 図表の並列処理対応、TypeScript + Puppeteerによる効率的な変換
- 📊 **進捗表示**: リアルタイムプログレスバーで変換進行状況を可視化

## 🚀 クイックスタート

### 必要要件

- Node.js 18.0.0以上
- Java（PlantUML図表使用時）

### インストールと実行

```bash
# リポジトリをクローン
git clone https://github.com/makdrive/md2pdf.git
cd md2pdf

# 依存関係をインストール
npm install

# PlantUML.jarをダウンロード（PlantUML図表使用時のみ）
curl -L -o plantuml.jar https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar

# ビルド
npm run build

# サンプル実行
npm run dev sample.md
```

生成されたPDFは `sample.pdf` として保存されます。

### PlantUMLセットアップ

PlantUML図表を使用する場合は、以下の手順でセットアップしてください：

#### 方法1: 自動ダウンロード（推奨）

```bash
# 最新版をダウンロード
curl -L -o plantuml.jar https://github.com/plantuml/plantuml/releases/latest/download/plantuml.jar

# または特定バージョンをダウンロード
curl -L -o plantuml.jar https://github.com/plantuml/plantuml/releases/download/v1.2025.3/plantuml-mit-1.2025.3.jar
```

#### 方法2: 手動ダウンロード

1. [PlantUML Releases](https://github.com/plantuml/plantuml/releases/latest)にアクセス
2. `plantuml.jar`または`plantuml-mit-*.jar`をダウンロード
3. プロジェクトルートに`plantuml.jar`として配置

#### 方法3: カスタムパス指定

```bash
# カスタムパスのjarファイルを使用
npm run dev -- sample.md --plantuml-jar /path/to/your/plantuml.jar
```

**注意**: PlantUML図表を使用しない場合、jarファイルのダウンロードは不要です。

## 📖 使用方法

### 基本コマンド

```bash
# 開発モードで実行
npm run dev <input.md>

# ビルド後実行
node dist/cli/index.js <input.md>
```

### オプション

```bash
npm run dev -- sample.md [options]

Options:
  -o, --output <file>           出力PDFファイル名
  -f, --format <format>         PDFフォーマット (A4, Letter, Legal)
  -m, --margin <margin>         ページマージン (例: 20mm)
  -c, --concurrency <number>    図表処理の並列数 (デフォルト: 8)
  --header <text>               ページヘッダー
  --footer <text>               ページフッター
  --mermaid-theme <theme>       Mermaidテーマ (default, dark, forest)
  --plantuml-jar <path>         PlantUMLのjarファイルパス
  --no-progress                 プログレスバーを非表示
  --progress-format <format>    プログレスバー表示形式
  -h, --help                    ヘルプを表示
```

### 使用例

```bash
# 基本的な変換
npm run dev document.md

# 出力ファイル名を指定
npm run dev document.md -o report.pdf

# A4、25mmマージン、ダークテーマで変換
npm run dev document.md -f A4 -m 25mm --mermaid-theme dark

# ヘッダー・フッターを追加
npm run dev document.md --header "技術仕様書" --footer "Page {pageNumber}"

# 並列処理数を調整（図表が多い場合）
npm run dev document.md -c 4

# 高速処理（並列数を増加）
npm run dev document.md -c 16

# プログレスバーを非表示
npm run dev document.md --no-progress

# プログレスバーの表示形式をカスタマイズ
npm run dev document.md --progress-format "変換中 |{bar}| {percentage}% | {stage}"
```

## 📊 対応図表

### Mermaid図表

```markdown
\`\`\`mermaid
graph LR
    A[開始] --> B{判定}
    B -->|Yes| C[処理A]
    B -->|No| D[処理B]
    C --> E[終了]
    D --> E
\`\`\`
```

**対応形式**: フローチャート、シーケンス図、ガントチャート、クラス図など

### PlantUML図表

```markdown
\`\`\`plantuml
@startuml
Alice -> Bob: Hello
Bob -> Alice: Hi!
@enduml
\`\`\`
```

**対応形式**: シーケンス図、クラス図、アクティビティ図、ユースケース図など

## 📊 プログレス表示

md2pdfはリアルタイムプログレスバーで変換進行状況を可視化します。

### 機能

- **デフォルト表示**: プログレスバーがデフォルトで表示されます
- **リアルタイム更新**: 図表処理中も進捗がリアルタイムで更新
- **詳細な進行状況**: 各処理ステップの状況を表示
  - ファイル読み込み
  - Markdown解析
  - 図表処理（個別の図表ごと）
  - HTML生成
  - PDF生成

### プログレスバーの制御

```bash
# デフォルト: プログレスバー表示
npm run dev document.md

# プログレスバーを非表示
npm run dev document.md --no-progress

# カスタム表示形式
npm run dev document.md --progress-format "進捗 |{bar}| {percentage}% | {stage}"
```

### 表示例

```
Progress |████████████████████| 100% | Completed mermaid diagram: flowchart-1 (3/5)
```

## ⚡ パフォーマンス

### 並列処理

md2pdfは図表処理の並列実行に対応しており、複数の図表を含むドキュメントを高速で処理できます。

```bash
# 並列数の調整例
npm run dev document.md -c 4   # 4個並列（低負荷）
npm run dev document.md -c 8   # 8個並列（デフォルト、推奨）
npm run dev document.md -c 16  # 16個並列（高速、高負荷）
```

**推奨設定**:
- **4個並列**: メモリ使用量を抑えたい場合
- **8個並列**: 標準的な使用（デフォルト）
- **16個以上**: 図表が多く高速処理したい場合

### パフォーマンステスト

性能テスト用のサンプルが含まれています：

```bash
# 20個の図表を含むテストファイルで性能測定
npm run dev performance-test.md -c 8

# 並列数4での測定
npm run dev performance-test.md -c 4

# 並列数16での測定
npm run dev performance-test.md -c 16
```

## 🎨 フォント

### 日本語フォント: BIZ UDPGothic

- **ユニバーサルデザイン**: 読みやすさを重視した設計
- **高品質**: Google Fonts提供の無料フォント
- **統一性**: 本文・図表で同一フォント使用

### フォントインストール（推奨）

```bash
# macOSの場合
# 1. https://fonts.google.com/specimen/BIZ+UDPGothic
# 2. "Download family"をクリック
# 3. .ttfファイルをダブルクリックしてインストール
```

## 📁 プロジェクト構成

```
md2pdf/
├── src/
│   ├── parsers/          # Markdown・図表解析
│   │   ├── markdown.ts   # Markdown処理
│   │   ├── mermaid.ts    # Mermaid図表処理
│   │   └── plantuml.ts   # PlantUML図表処理
│   ├── renderers/        # レンダリング
│   │   ├── html.ts       # HTML生成
│   │   └── diagram.ts    # 図表統合
│   ├── generators/       # PDF生成
│   │   └── pdf.ts        # PDF変換
│   ├── cli/             # CLI処理
│   │   └── index.ts      # コマンドライン
│   ├── converter.ts     # メイン処理
│   └── types.ts         # 型定義
├── plantuml.jar         # PlantUML実行ファイル
├── sample.md           # サンプルファイル
└── README.md           # 本ファイル
```

## 🛠️ 開発

### ビルドと実行

```bash
# TypeScriptビルド
npm run build

# 開発モード（ファイル監視）
npm run dev

# テスト実行
npm test

# 単体テストのみ
npm run test:unit

# 統合テストのみ
npm run test:integration

# カバレッジ付きテスト
npm run test:coverage

# リント
npm run lint

# クリーンビルド
npm run clean && npm run build
```

### 技術スタック

- **Node.js + TypeScript**: 型安全な開発
- **Puppeteer**: HTML→PDF変換
- **markdown-it**: Markdown解析
- **Mermaid**: 図表ライブラリ
- **Commander.js**: CLI構築

## 📝 Markdownサポート

### 基本要素

- ✅ 見出し（H1-H6）
- ✅ テキスト装飾（**太字**、*斜体*、`コード`）
- ✅ リスト（順序付き・順序なし）
- ✅ コードブロック
- ✅ 引用（> 引用文）
- ✅ 表（テーブル）
- ✅ リンク

### 図表要素

- ✅ Mermaid図表（\`\`\`mermaid）
- ✅ PlantUML図表（\`\`\`plantuml）

## 🔧 トラブルシューティング

### 一般的な問題

**Q: 図表が表示されない**

- PlantUMLの場合:
  - Javaがインストールされていることを確認
  - `plantuml.jar`がプロジェクトルートに配置されていることを確認
  - 図表構文が正しいことを確認

**Q: PlantUMLが見つからないエラー**

- `plantuml.jar`をダウンロードしてプロジェクトルートに配置
- カスタムパスを指定: `--plantuml-jar /path/to/plantuml.jar`

**Q: フォントが変わらない**
- BIZ UDPGothicをシステムにインストール
- インターネット接続を確認（Google Fonts使用時）

**Q: PDFが生成されない**
- 出力ディレクトリの書き込み権限を確認
- 入力ファイルパスが正しいことを確認

### デバッグ

```bash
# 詳細なエラー情報を表示
DEBUG=1 npm run dev sample.md

# Puppeteerのヘッドレスモードを無効化（開発時）
HEADLESS=false npm run dev sample.md
```

## 📄 ライセンス

MIT License

---

**md2pdf** - Beautiful PDF generation from Markdown with diagram support 🎨
