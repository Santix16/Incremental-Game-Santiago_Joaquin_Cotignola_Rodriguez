import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'] // <-- Vinculamos el estilo
})
export class Menu {
  constructor(private router: Router) {}

  nav(path: string) {
    // Aquí podrías añadir un sonido de "click" antes de navegar si quisieras
    this.router.navigate([path]);
  }
}