export function calculateShortDescription(description: string): string {
  // Get first 100 characters and add ellipsis if needed
  return description.length > 100 
    ? `${description.substring(0, 97)}...`
    : description;
}

export function calculateCubicWeight(dimensions: {
  comprimento: number;
  largura: number;
  altura: number;
}): number {
  const { comprimento, largura, altura } = dimensions;
  if (!comprimento || !largura || !altura) return 0;

  // Calculate cubic weight in kg (length * width * height) / 6000
  return Number(((comprimento * largura * altura) / 6000).toFixed(3));
}

export function calculateVolume(dimensions: {
  comprimento: number;
  largura: number;
  altura: number;
}): number {
  const { comprimento, largura, altura } = dimensions;
  if (!comprimento || !largura || !altura) return 0;

  // Calculate volume in cubic meters (cm³ to m³)
  return Number(((comprimento * largura * altura) / 1000000).toFixed(3));
}