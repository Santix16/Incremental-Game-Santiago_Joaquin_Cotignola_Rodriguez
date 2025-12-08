import { Injectable, signal, WritableSignal } from '@angular/core';
import { Booster } from '../interfaces/booster';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  level: WritableSignal<number>;
  clicks: WritableSignal<number>;
  difficulty: WritableSignal<Difficulty>;
  boosters: WritableSignal<Booster[]>;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private _leveledUp = false;
  private _level = signal(1);
  private _clicks = signal(0);
  private _difficulty = signal<Difficulty>('easy');
  private _boosters = signal<Booster[]>([
    { id: 1, name: "Click x2", price: 20, multiplier: 2, owned: false },
    { id: 2, name: "Click x3", price: 50, multiplier: 3, owned: false },
    { id: 3, name: "Click x5", price: 120, multiplier: 5, owned: false }
  ]);

  state(): GameState {
    return {
      level: this._level,
      clicks: this._clicks,
      difficulty: this._difficulty,
      boosters: this._boosters,
    };
  }

  click() {
    this._clicks.update(c => c + 1);
    this.checkLevelUp();
  }

  private clicksRequiredForLevel(): number {
    switch (this._difficulty()) {
      case 'easy': return 5;
      case 'medium': return 10;
      case 'hard': return 20;
    }
  }

  checkLevelUp() {
    const difficulty = this._difficulty();
    const multiplier = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
    const required = this._level() * multiplier;

    if (this._clicks() >= required) {
      this.nextLevel();
      this._clicks.set(0);
      this._leveledUp = true;
    }
  }

  nextLevel() {
  this._level.update(l => l + 1);

  const bonus = this._boosters().reduce(
    (sum, b) => b.owned ? sum + b.multiplier : 0,
    0
  );

  this._clicks.update(c => c + bonus);
  }

  buyBooster(booster: Booster) {
  if (!booster.owned && this._clicks() >= booster.price) {
    this._clicks.update(c => c - booster.price);
    booster.owned = true;
    this._boosters.update(list => [...list]);
  }
  }

  updateDifficulty(difficulty: Difficulty) {
    this._difficulty.set(difficulty);
  }

  justLeveledUp() { return this._leveledUp; }
  clearLevelFlag() { this._leveledUp = false; }

  get boosters() {
  return this._boosters();
  }

}




