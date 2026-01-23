import { Component } from '@angular/core';
import { ConfigForm } from '../../components/config-form/config-form';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ConfigForm, RouterLink],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings {
  constructor(private game: GameService) {}

}