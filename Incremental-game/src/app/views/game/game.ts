import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { WorkerItem } from '../../components/worker-item/worker-item';
import { ProductItem } from '../../components/product-item/product-item';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RouterLink, WorkerItem, ProductItem],
  templateUrl: './game.html',
  styleUrls: ['./game.css'] // <-- Vinculación crucial
})
export class Game {
  constructor(public game: GameService) {}
}