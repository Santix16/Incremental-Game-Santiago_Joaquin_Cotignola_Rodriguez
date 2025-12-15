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

  // Calcula el coste real aplicando el multiplicador actual
  get effectiveHireCost(): number {
    return Math.floor(this.worker.hireCost * this.game.difficultyMultiplier);
  }

  get effectiveUpgradeCost(): number {
    return Math.floor(this.worker.upgradeCost * this.game.difficultyMultiplier);
  }

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