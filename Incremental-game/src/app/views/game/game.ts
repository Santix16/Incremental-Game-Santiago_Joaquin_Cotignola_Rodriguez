import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importamos Router
import { GameService } from '../../services/game.service';
import { WorkerItem } from '../../components/worker-item/worker-item';
import { ProductItem } from '../../components/product-item/product-item';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink, WorkerItem, ProductItem],
  templateUrl: './game.html',
  styleUrls: ['./game.css']
})
export class Game {
  isMenuOpen = false;

  constructor(public game: GameService, private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(path: string) {
    this.isMenuOpen = false; // Cerramos el drawer antes de irnos
    this.router.navigate([path]);
  }
}