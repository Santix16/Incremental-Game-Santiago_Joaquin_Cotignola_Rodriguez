import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class SaveService {
  constructor(private http: HttpClient, private game: GameService) {}

  save(userId: number) {
    const state = {
      level: this.game.state().level(),
      clicks: this.game.state().clicks(),
      points: this.game.state().points(),
      coins: this.game.state().coins(),
      boosters: this.game.boosters
    };
    return this.http.post(`http://localhost:3000/save/${userId}`, state).subscribe();
  }

  load(userId: number) {
    this.http.get<any>(`http://localhost:3000/save/${userId}`).subscribe(data => {
      this.game.state().level.set(data.level);
      this.game.state().clicks.set(data.clicks);
      this.game.state().points.set(data.points);
      this.game.state().coins.set(data.coins);
      // actualizar boosters
      const boosters = this.game.state().boosters();
      data.boosters.forEach((b: any) => {
        const booster = boosters.find(x => x.id === b.id);
        if (booster) booster.owned = b.owned;
      });
      this.game.state().boosters.set([...boosters]);
    });
  }
}





