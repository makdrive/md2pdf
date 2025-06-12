#!/usr/bin/env node

import { Command } from 'commander';
import * as path from 'path';
import { Md2PdfConverter } from '../converter';
import { Config } from '../types';

const program = new Command();

program
  .name('md2pdf')
  .description('Convert Markdown files to PDF with Mermaid and PlantUML support')
  .version('1.0.0');

program
  .argument('<input>', 'input Markdown file')
  .option('-o, --output <file>', 'output PDF file')
  .option('-f, --format <format>', 'PDF format (A4, Letter, Legal)', 'A4')
  .option('-m, --margin <margin>', 'page margin', '20mm')
  .option('--header <text>', 'page header text')
  .option('--footer <text>', 'page footer text')
  .option('--mermaid-theme <theme>', 'Mermaid theme (default, dark, forest)', 'default')
  .option('--plantuml-jar <path>', 'path to PlantUML jar file')
  .option('-c, --concurrency <number>', 'maximum number of diagrams to process in parallel', '8')
  .action(async (input: string, options) => {
    try {
      // 出力ファイル名を決定
      const output = options.output || input.replace(/\.md$/, '.pdf');
      
      // 設定を構築
      const config: Partial<Config> = {
        pdf: {
          format: options.format as 'A4' | 'Letter' | 'Legal',
          margin: options.margin,
          header: options.header,
          footer: options.footer,
        },
        diagrams: {
          mermaid: {
            theme: options.mermaidTheme as 'default' | 'dark' | 'forest',
            scale: 1,
          },
          plantuml: {
            jarPath: options.plantumlJar,
            timeout: 30000,
          },
          concurrency: parseInt(options.concurrency, 10) || 8,
        },
      };

      // 変換を実行
      const converter = new Md2PdfConverter(config);
      await converter.convert({
        input: path.resolve(input),
        output: path.resolve(output),
        config,
      });

      // 正常終了時は明示的にプロセスを終了
      process.exit(0);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

// エラーハンドリング
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

program.parse(process.argv);