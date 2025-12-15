import { WritableSignal } from "@angular/core";
import { Resource } from "./resource";
import { WorkerUnit } from "./worker";
import { Product } from "./product";

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameSettings {
  volume: number;
  sfxEnabled: boolean;
  difficulty: Difficulty; // Nueva propiedad principal
}

export interface GameState {
  money: WritableSignal<number>;
  resources: WritableSignal<Resource[]>;
  workers: WritableSignal<WorkerUnit[]>;
  products: WritableSignal<Product[]>;
  settings: WritableSignal<GameSettings>;
}