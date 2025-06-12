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

## 重要な注意事項

- このプロジェクトはTypeScript/Node.jsで実装されています
- CLIツールのエントリーポイントは`dist/cli/index.js`です（ビルド後）
- ソースコードは`src/`ディレクトリにあります

## プロジェクト構成

- `src/`: TypeScriptソースコード
- `dist/`: ビルド後のJavaScriptファイル
- `plantuml.jar`: PlantUML図表生成用のJARファイル
- `temp/`: 一時ファイル用ディレクトリ

## 依存関係

- Node.js環境が必要
- PlantUML図表を生成する場合はJavaランタイムが必要（plantuml.jarを実行するため）
