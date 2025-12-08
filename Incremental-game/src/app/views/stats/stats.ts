import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './stats.html'
})
export class Stats {
  constructor(public game: GameService) {}
}


