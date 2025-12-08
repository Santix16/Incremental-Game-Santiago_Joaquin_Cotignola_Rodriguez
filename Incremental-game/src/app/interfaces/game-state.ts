import { Generator } from "./generator";
import { Upgrade } from "./upgrade";

export interface GameState {
  resources: number;
  generators: Generator[];
  upgrades: Upgrade[];
  level: number;
  achievements: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

