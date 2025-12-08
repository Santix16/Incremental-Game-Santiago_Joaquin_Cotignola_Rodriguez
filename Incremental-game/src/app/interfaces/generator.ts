export interface Generator {
  id: number;
  name: string;
  level: number;
  basePrice: number;
  baseProduction: number;
  currentPrice: number;
  productionPerSecond: number;
  incrementMultiplier: number;
}

