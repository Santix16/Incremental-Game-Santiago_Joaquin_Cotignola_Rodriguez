import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { WorkerUnit } from '../../interfaces/worker';

@Component({
  selector: 'app-worker-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-item.html'
})
export class WorkerItem {
  @Input() worker!: WorkerUnit;

  constructor(public game: GameService) {}

  // Helper para saber si se puede permitir comprar
  canAfford(cost: number): boolean {
    return this.game.state().money() >= cost;
  }
}