import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService, Difficulty } from '../../services/game.service';

@Component({
  selector: 'app-config-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-form.html'
})
export class ConfigForm {
  constructor(public game: GameService) {}

  save() {
    const currentDifficulty: Difficulty = this.game.state().difficulty();
    this.game.updateDifficulty(currentDifficulty);
    alert('Configuración guardada!');
  }
}


