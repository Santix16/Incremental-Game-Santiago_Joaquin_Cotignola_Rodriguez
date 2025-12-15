import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css']
})
export class Menu {
  constructor(private router: Router, private game: GameService) {}

  nav(path: string) {
    this.router.navigate([path]);
  }

  newGame() {
    if (confirm("⚠️ ¿Estás seguro de que quieres empezar una NUEVA PARTIDA?\n\nSe borrará todo el progreso actual (Dinero, Trabajadores, Recursos).")) {
      this.game.hardReset(); // Reinicia estado
      this.router.navigate(['/game']); // Navega al juego limpio
    }
  }
}