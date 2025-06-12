import { DiagramBlock, Config, ProgressCallback } from '../types';
import { MermaidProcessor } from '../parsers/mermaid';
import { PlantUMLProcessor } from '../parsers/plantuml';

export class DiagramRenderer {
  private config: Config;
  private mermaidProcessor: MermaidProcessor;
  private plantUMLProcessor: PlantUMLProcessor;

  constructor(config: Config) {
    this.config = config;
    this.mermaidProcessor = new MermaidProcessor(config);
    this.plantUMLProcessor = new PlantUMLProcessor(config);
  }

  public async renderDiagrams(diagrams: DiagramBlock[], progressCallback?: ProgressCallback): Promise<Map<string, string>> {
    const renderedDiagrams = new Map<string, string>();
    const concurrency = this.config.diagrams.concurrency || 8;
    const totalDiagrams = diagrams.length;
    let processedCount = 0;

    // プログレスカウンターを安全に更新する関数
    const updateProgress = (diagramType: string, diagramId: string, isError: boolean = false) => {
      processedCount++;
      if (progressCallback) {
        const status = isError ? 'Error processing' : 'Completed';
        progressCallback(processedCount, totalDiagrams, `${status} ${diagramType} diagram: ${diagramId}`);
      }
    };

    // 並列処理を制限するためのバッチ処理
    const results: { id: string; path: string }[] = [];
    
    for (let i = 0; i < diagrams.length; i += concurrency) {
      const batch = diagrams.slice(i, i + concurrency);
      
      // バッチ内の図表を並列処理
      const batchPromises = batch.map(async (diagram) => {
        // 図表処理開始をプログレスに通知
        if (progressCallback) {
          progressCallback(processedCount, totalDiagrams, `Starting ${diagram.type} diagram: ${diagram.id}`);
        }

        try {
          let imagePath: string;

          switch (diagram.type) {
            case 'mermaid':
              imagePath = await this.mermaidProcessor.processMermaidBlock(diagram);
              break;
            case 'plantuml':
              imagePath = await this.plantUMLProcessor.processPlantUMLBlock(diagram);
              break;
            default:
              imagePath = this.createPlaceholder(diagram.id, 'Unsupported diagram type');
          }

          // 図表処理完了時に即座にプログレスを更新
          updateProgress(diagram.type, diagram.id);

          return { id: diagram.id, path: imagePath };
        } catch (error) {
          console.error(`Failed to render diagram ${diagram.id}:`, error);
          const errorPath = this.createPlaceholder(
            diagram.id, 
            `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
          
          // エラー時も即座にプログレスを更新
          updateProgress(diagram.type, diagram.id, true);

          return { id: diagram.id, path: errorPath };
        }
      });

      // バッチの処理が完了するまで待機
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    // 結果をMapに格納
    for (const result of results) {
      renderedDiagrams.set(result.id, result.path);
    }

    return renderedDiagrams;
  }

  public async cleanup(): Promise<void> {
    await this.mermaidProcessor.cleanup();
    await this.plantUMLProcessor.cleanup();
  }

  private createPlaceholder(diagramId: string, message: string): string {
    return `data:image/svg+xml;base64,${Buffer.from(`
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0" stroke="#ccc" stroke-width="2"/>
        <text x="50%" y="40%" text-anchor="middle" font-family="Arial" font-size="14" fill="#666">
          図表プレースホルダー (${diagramId})
        </text>
        <text x="50%" y="60%" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">
          ${message}
        </text>
      </svg>
    `).toString('base64')}`;
  }
}