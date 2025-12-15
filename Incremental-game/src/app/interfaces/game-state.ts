import { WritableSignal } from "@angular/core";
import { Resource } from "./resource";
import { WorkerUnit } from "./worker";
import { Product } from "./product";

// Definimos qué es la configuración
export interface GameSettings {
  volume: number;
  sfxEnabled: boolean;
  notificationsEnabled: boolean;
  powerSavingMode: boolean;
}

export interface GameState {
  money: WritableSignal<number>;
  resources: WritableSignal<Resource[]>;
  workers: WritableSignal<WorkerUnit[]>;
  products: WritableSignal<Product[]>;
  settings: WritableSignal<GameSettings>; // <-- Nueva señal de configuración

  // Mantengo estas opcionales por si las usas en otro lado, o puedes borrarlas si ya no sirven
  level?: number; 
  achievements?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}