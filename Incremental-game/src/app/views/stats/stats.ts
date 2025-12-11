import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';
import { Menu } from '../menu/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, Menu, RouterLink],
  templateUrl: './stats.html'
})
export class Stats implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getRanking().subscribe(data => {
      this.users = data;
    });
  }
}



