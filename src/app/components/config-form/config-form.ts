import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Difficulty } from '../../interfaces/game-state';

@Component({
  selector: 'app-config-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-form.html',
  styleUrls: ['./config-form.css']
})
export class ConfigForm {
  
  constructor(public game: GameService) {}

  get settings() { return this.game.state().settings(); }

  toggleSfx() {
    this.game.updateSettings({ sfxEnabled: !this.settings.sfxEnabled });
  }

  setDifficulty(diff: Difficulty) {
    this.game.updateSettings({ difficulty: diff });
  }

  setVolume(event: any) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.round((x / width) * 100);
    const newVolume = Math.max(0, Math.min(100, percentage));
    this.game.updateSettings({ volume: newVolume });
  }

  save() {
    this.game.saveGame();
    alert('SISTEMA REINICIADO CON NUEVOS PARÁMETROS');
  }
}