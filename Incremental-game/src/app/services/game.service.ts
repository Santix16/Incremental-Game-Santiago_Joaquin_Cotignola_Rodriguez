import { Injectable, signal, WritableSignal } from '@angular/core';
import { Booster } from '../interfaces/booster';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameState {
  level: WritableSignal<number>;
  clicks: WritableSignal<number>;
  points: WritableSignal<number>;
  coins: WritableSignal<number>;
  difficulty: WritableSignal<Difficulty>;
  boosters: WritableSignal<Booster[]>;
}

@Injectable({ providedIn: 'root' })
export class GameService {
  private _leveledUp = false;
  private _level = signal(1);
  private _clicks = signal(0);
  private _points = signal(0);
  private _coins = signal(0);
  private _difficulty = signal<Difficulty>('medium');
  private _boosters = signal<Booster[]>([
    { id: 1, name: "Click x2", price: 10, multiplier: 2, owned: false },
    { id: 2, name: "Click x3", price: 25, multiplier: 3, owned: false },
    { id: 3, name: "Click x5", price: 50, multiplier: 5, owned: false }
  ]);

  state(): GameState {
    return {
      level: this._level,
      clicks: this._clicks,
      points: this._points,
      coins: this._coins,
      difficulty: this._difficulty,
      boosters: this._boosters
    };
  }

  click() {
    const multiplier = this._boosters().reduce((m, b) => b.owned ? m * b.multiplier : m, 1);
    this._clicks.update(c => c + multiplier);
    this._points.update(p => p + 1);
    this.checkLevelUp();
  }

  pointsRequiredForLevel(): number {
    const base = 10;
    switch (this._difficulty()) {
      case 'easy': return Math.floor(base * this._level() / 2);
      case 'medium': return base * this._level();
      case 'hard': return base * this._level() * 2;
    }
  }

  checkLevelUp() {
    const required = this.pointsRequiredForLevel();
    if (this._points() >= required) {
      this.nextLevel();
      this._points.set(0);
      this._coins.update(c => c + 5);
      this._leveledUp = true;
    }
  }

  nextLevel() {
    this._level.update(l => l + 1);
  }

  buyBooster(booster: Booster) {
    if (!booster.owned && this._coins() >= booster.price) {
      this._coins.update(c => c - booster.price);
      booster.owned = true;
      this._boosters.update(list => [...list]);
    }
  }

  updateDifficulty(difficulty: Difficulty) {
    this._difficulty.set(difficulty);
  }

  justLeveledUp() { return this._leveledUp; }
  clearLevelFlag() { this._leveledUp = false; }

  get boosters() { return this._boosters(); }
}





