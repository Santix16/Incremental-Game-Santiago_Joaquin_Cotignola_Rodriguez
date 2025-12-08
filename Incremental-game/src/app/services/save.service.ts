import { Injectable } from '@angular/core';
import { GameService, GameState } from './game.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SaveService {
  constructor(private http: HttpClient, private game: GameService) {}

  save() {
    const state = {
      clicks: this.game.state().clicks(),
      level: this.game.state().level(),
      difficulty: this.game.state().difficulty(),
      boosters: this.game.state().boosters()
    };
    return this.http.post('http://localhost:3000/save', state).subscribe();
  }

  load() {
    this.http.get<{
      clicks: number;
      level: number;
      difficulty: 'easy' | 'medium' | 'hard';
      boosters: any[];
    }>('http://localhost:3000/save').subscribe(data => {
      this.game.state().clicks.set(data.clicks);
      this.game.state().level.set(data.level);
      this.game.state().difficulty.set(data.difficulty);
      this.game.state().boosters.set(data.boosters);
    });
  }
}





