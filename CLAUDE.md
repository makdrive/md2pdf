# md2pdf プロジェクト仕様

## プロジェクト概要

このプロジェクトはTypeScript/Node.jsで実装されたMarkdownからPDFへの変換ツールです。

## 技術スタック

- 言語: TypeScript
- ランタイム: Node.js
- ビルドツール: TypeScript Compiler (tsc)
- パッケージマネージャー: npm

## ビルドと実行方法

### ビルド

```bash
npm run build
```

### 実行

```bash
node dist/cli/index.js <input.md> <output.pdf>
```

### 開発時の実行

```bash
npm run dev <input.md> <output.pdf>
```

### テスト実行

```bash
npm test                    # 全テスト実行
npm run test:unit          # 単体テストのみ  
npm run test:integration   # 統合テストのみ
npm run test:coverage      # カバレッジ付き
```

## 重要な注意事項

- このプロジェクトはTypeScript/Node.jsで実装されています
- CLIツールのエントリーポイントは`dist/cli/index.js`です（ビルド後）
- ソースコードは`src/`ディレクトリにあります

## CLIオプション

### 並列処理制御

```bash
# 並列数を指定（デフォルト: 8）
node dist/cli/index.js -c 4 <input.md> <output.pdf>   # 4個並列
node dist/cli/index.js -c 16 <input.md> <output.pdf>  # 16個並列
```

### プログレス表示オプション

```bash
# プログレスバーを非表示（デフォルトは表示）
node dist/cli/index.js --no-progress <input.md> <output.pdf>

# プログレスバーの表示形式をカスタマイズ
node dist/cli/index.js --progress-format "処理中 |{bar}| {percentage}% | {stage}" <input.md> <output.pdf>
```

### その他オプション

- `-o, --output`: 出力ファイル名
- `-f, --format`: PDFフォーマット（A4, Letter, Legal）
- `-m, --margin`: ページマージン
- `--mermaid-theme`: Mermaidテーマ（default, dark, forest）
- `--plantuml-jar`: PlantUMLのjarファイルパス
- `--no-progress`: プログレスバーを非表示にする
- `--progress-format`: プログレスバーの表示形式を指定

### 性能テスト

```bash
# 20個の図表を含むサンプルで性能測定
node dist/cli/index.js performance-test.md -c 8
```

## プロジェクト構成

- `src/`: TypeScriptソースコード
- `dist/`: ビルド後のJavaScriptファイル
- `tests/`: テストコード（単体・統合テスト）
- `plantuml.jar`: PlantUML図表生成用のJARファイル
- `performance-test.md`: 性能テスト用サンプル（20個の図表）
- `temp/`: 一時ファイル用ディレクトリ

## 依存関係

- Node.js環境が必要
- PlantUML図表を生成する場合はJavaランタイムが必要（plantuml.jarを実行するため）
