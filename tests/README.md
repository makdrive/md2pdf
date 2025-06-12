# テストについて

このディレクトリには、md2pdfプロジェクトのテストコードが含まれています。

## テスト構成

### 単体テスト (`tests/unit/`)
- `converter.test.ts`: コンバーターの設定処理をテスト
- `markdown-parser.test.ts`: Markdownパーサーの機能をテスト
- `diagram-renderer.test.ts`: 図表レンダラーの並列処理をテスト

### 統合テスト (`tests/integration/`)
- `end-to-end.test.ts`: 全体的な変換処理のテスト

### テスト実行方法

```bash
# すべてのテストを実行
npm test

# 単体テストのみ実行
npm run test:unit

# 統合テストのみ実行
npm run test:integration

# カバレッジ付きでテスト実行
npm run test:coverage

# ウォッチモードでテスト実行
npm run test:watch
```

## テスト方針

- **単体テスト**: 各モジュールの機能を独立してテスト
- **統合テスト**: 実際のファイル変換処理をテスト
- **モック使用**: 外部依存（Puppeteer、PlantUML）はモック化

## 注意事項

- 統合テストは実際にPuppeteerを起動するため、時間がかかります
- テスト用の一時ファイルは自動的にクリーンアップされます
- Puppeteerのタイムアウトは30秒に設定されています