export class MermaidProcessor {
  constructor(config: any) {}

  async processMermaidBlock(block: any): Promise<string> {
    if (block.source.includes('invalid')) {
      throw new Error('Invalid Mermaid syntax');
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibHVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIj5UZXN0PC90ZXh0Pjwvc3ZnPg==';
  }

  async cleanup(): Promise<void> {
    // Mock cleanup
  }
}