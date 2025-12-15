import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-config-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './config-form.html',
  styleUrls: ['./config-form.css']
})
export class ConfigForm {
  
  constructor(public game: GameService) {}

  // Helpers para acceder a los valores actuales del servicio
  get settings() { return this.game.state().settings(); }

  // Métodos que actualizan el servicio GLOBALMENTE
  toggleSfx() {
    this.game.updateSettings({ sfxEnabled: !this.settings.sfxEnabled });
  }

  toggleNotifications() {
    this.game.updateSettings({ notificationsEnabled: !this.settings.notificationsEnabled });
  }

  togglePowerMode() {
    this.game.updateSettings({ powerSavingMode: !this.settings.powerSavingMode });
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
    // Forzamos un guardado manual extra (aunque updateSettings ya guarda)
    this.game.saveGame();
    alert('CONFIGURACIÓN GUARDADA EN SISTEMA');
  }
}