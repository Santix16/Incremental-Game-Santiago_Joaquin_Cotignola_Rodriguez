import { ResourceType } from './resource';

export interface WorkerUnit {
  id: number;
  name: string;
  targetResource: ResourceType;
  count: number;          
  baseProduction: number; 
  speedMs: number;        
  hireCost: number;       
  upgradeCost: number;    
  lastWorked: number;     
}