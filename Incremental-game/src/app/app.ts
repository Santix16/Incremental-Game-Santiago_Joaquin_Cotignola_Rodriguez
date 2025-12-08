import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html'
})
export class App {
  constructor(public game: GameService) {}

  get level() {
    return this.game.state().level();
  }

  get clicks() {
    return this.game.state().clicks();
  }

  get difficulty() {
    return this.game.state().difficulty();
  }
}

