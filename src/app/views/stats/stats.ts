import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GameService } from '../../services/game.service'; // Importar
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stats.html',
  styleUrls: ['./stats.css']
})
export class Stats implements OnInit {
  users: User[] = [];
  activeTab: 'achievements' | 'ranking' = 'achievements'; // Pestaña por defecto

  constructor(private userService: UserService, public game: GameService) {}

  ngOnInit() {
    this.userService.getRanking().subscribe(data => {
      this.users = data;
    });
  }

  setTab(tab: 'achievements' | 'ranking') {
    this.activeTab = tab;
  }
}