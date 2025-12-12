import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-config-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-form.html'
})
export class ConfigForm {
  constructor(public game: GameService) {}

  save() {
    // La dificultad está deshabilitada temporalmente en el nuevo modo Tycoon
    alert('Configuración guardada!');
  }
}