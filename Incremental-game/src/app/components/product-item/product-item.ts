import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.html',
  styleUrls: ['./product-item.css']
})
export class ProductItem {
  @Input() product!: Product;

  constructor(public game: GameService) {}

  // Verifica si hay recursos suficientes para fabricar uno
  canCraft(): boolean {
    const resources = this.game.state().resources();
    return this.product.cost.every(req => {
      const res = resources.find(r => r.type === req.type);
      return res ? res.amount >= req.amount : false;
    });
  }

  // Mapeo rápido de iconos por tipo de recurso
  getResourceIcon(type: string): string {
    const icons: any = { 'wood': '🌲', 'iron': '⛏️', 'silicon': '💠' };
    return icons[type] || '❓';
  }
}