export interface Upgrade {
  id: number;
  name: string;
  description: string;
  price: number;
  applied: boolean;
  targetGeneratorId?: number;
  multiplier?: number;
}


