export type ResourceType = 'wood' | 'iron' | 'silicon' | 'gold';

export interface Resource {
  type: ResourceType;
  name: string;
  amount: number;
  icon: string;
}