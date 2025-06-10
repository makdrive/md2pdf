import { DiagramBlock, Config } from '../types';
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

  public async renderDiagrams(diagrams: DiagramBlock[]): Promise<Map<string, string>> {
    const renderedDiagrams = new Map<string, string>();

    for (const diagram of diagrams) {
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

        renderedDiagrams.set(diagram.id, imagePath);
      } catch (error) {
        console.error(`Failed to render diagram ${diagram.id}:`, error);
        const errorPath = this.createPlaceholder(
          diagram.id, 
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
        renderedDiagrams.set(diagram.id, errorPath);
      }
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