import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DiagramBlock, Config } from '../types';

const execAsync = promisify(exec);

export class PlantUMLProcessor {
  private config: Config;
  private jarPath: string;
  private tempDir: string;

  constructor(config: Config, tempDir: string = './temp/plantuml') {
    this.config = config;
    this.jarPath = path.resolve('./plantuml.jar');
    this.tempDir = tempDir;
  }

  public async processPlantUMLBlock(block: DiagramBlock): Promise<string> {
    if (block.type !== 'plantuml') {
      throw new Error('Invalid block type for PlantUML processor');
    }

    try {
      // 出力ディレクトリを作成
      await fs.mkdir(this.tempDir, { recursive: true });

      // PlantUMLソースファイルを作成
      const sourceFileName = `${block.id}.puml`;
      const sourcePath = path.join(this.tempDir, sourceFileName);
      await fs.writeFile(sourcePath, block.source);

      // PlantUMLでSVGを生成
      const outputPath = path.join(this.tempDir, `${block.id}.svg`);
      await this.generateSVG(sourcePath, outputPath);

      // SVGファイルを読み込み
      const svgContent = await fs.readFile(outputPath, 'utf-8');
      
      // 一時ファイルを削除
      await fs.unlink(sourcePath);
      await fs.unlink(outputPath);

      // SVGの内容をBase64エンコードしてdata URLとして返す
      const base64Svg = Buffer.from(svgContent).toString('base64');
      
      return `data:image/svg+xml;base64,${base64Svg}`;
    } catch (error) {
      console.error(`Failed to process PlantUML diagram ${block.id}:`, error);
      return this.createErrorPlaceholder(block.id, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async generateSVG(sourcePath: string, outputPath: string): Promise<void> {
    // PlantUMLコマンドを実行（現在のディレクトリを出力先に指定）
    const command = `java -Dfile.encoding=UTF-8 -jar "${this.jarPath}" -tsvg "${sourcePath}"`;
    
    try {
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr && stderr.includes('Error')) {
        throw new Error(`PlantUML error: ${stderr}`);
      }
      
      // PlantUMLは入力ファイルと同じディレクトリにSVGファイルを生成
      const baseName = path.basename(sourcePath, '.puml');
      const sourceDir = path.dirname(sourcePath);
      const generatedSVGPath = path.join(sourceDir, `${baseName}.svg`);
      
      try {
        await fs.access(generatedSVGPath);
        // 期待されるパスと異なる場合は移動
        if (generatedSVGPath !== outputPath) {
          await fs.rename(generatedSVGPath, outputPath);
        }
      } catch {
        throw new Error('PlantUML did not generate expected output file');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('PlantUML did not generate')) {
        throw error;
      }
      throw new Error(`Failed to execute PlantUML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private createErrorPlaceholder(diagramId: string, errorMessage: string): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffe0e0" stroke="#ff6b6b" stroke-width="2"/>
        <text x="50%" y="30%" text-anchor="middle" font-family="BIZ UDPGothic, Arial" font-size="14" fill="#d63031">
          PlantUML図表エラー (${diagramId})
        </text>
        <text x="50%" y="50%" text-anchor="middle" font-family="BIZ UDPGothic, Arial" font-size="12" fill="#666">
          エラー: ${errorMessage.substring(0, 50)}...
        </text>
        <text x="50%" y="70%" text-anchor="middle" font-family="BIZ UDPGothic, Arial" font-size="10" fill="#999">
          図表の構文を確認してください
        </text>
      </svg>
    `).toString('base64')}`;
  }

  public async cleanup(): Promise<void> {
    try {
      // 一時ディレクトリを削除
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch (error) {
      // ディレクトリが存在しない場合は無視
    }
  }
}