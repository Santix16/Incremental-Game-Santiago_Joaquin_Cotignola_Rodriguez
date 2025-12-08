import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PauseConfirm } from '../../components/pause-confirm/pause-confirm';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink, PauseConfirm],
  templateUrl: './game.html'
})
export class Game {
  showPause = false;

  constructor(public game: GameService) {}

  clickResource() {
    this.game.click(); // sumar puntos y verificar subida de nivel

    // Si subió de nivel, mostrar popup
    if (this.game.justLeveledUp()) {
      this.showPause = true;
      this.game.clearLevelFlag();
    }
  }

  nextLevel() {
    this.showPause = false;
  }
}




