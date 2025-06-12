export class PlantUMLProcessor {
  constructor(config: any) {}

  async processPlantUMLBlock(block: any): Promise<string> {
    if (block.source.includes('invalid')) {
      throw new Error('Invalid PlantUML syntax');
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJncmVlbiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+VGVzdDwvdGV4dD48L3N2Zz4=';
  }

  async cleanup(): Promise<void> {
    // Mock cleanup
  }
}