import { ResourceType } from './resource';

export interface Product {
  id: number;
  name: string;
  cost: { type: ResourceType, amount: number }[];
  sellPrice: number;
  stock: number;
  icon: string;
}