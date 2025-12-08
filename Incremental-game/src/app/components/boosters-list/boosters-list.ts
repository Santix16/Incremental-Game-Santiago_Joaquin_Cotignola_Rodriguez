import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Booster } from '../../interfaces/booster';

@Component({
  selector: 'app-boosters-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boosters-list.html'
})
export class BoostersList {
  @Input() boosters: Booster[] = [];

  constructor(private game: GameService) {}

  buyBooster(booster: Booster) {
    this.game.buyBooster(booster);
  }
}

