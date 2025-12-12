import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { WorkerUnit } from '../../interfaces/worker';

@Component({
  selector: 'app-worker-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-item.html',
  styleUrls: ['./worker-item.css']
})
export class WorkerItem {
  @Input() worker!: WorkerUnit;

  constructor(public game: GameService) {}

  canAfford(cost: number): boolean { return this.game.state().money() >= cost; }

  getWorkerIcon(): string {
    switch(this.worker.targetResource) {
      case 'wood': return '🪓';
      case 'iron': return '⛏️';
      case 'silicon': return '🔬';
      default: return '👷';
    }
  }
}