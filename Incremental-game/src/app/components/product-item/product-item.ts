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

  // Calcula el máximo que se puede fabricar con los recursos actuales
  maxCraftable(): number {
    const resources = this.game.state().resources();
    let max = Infinity;

    this.product.cost.forEach(req => {
      const res = resources.find(r => r.type === req.type);
      if (res) {
        const canMake = Math.floor(res.amount / req.amount);
        if (canMake < max) max = canMake;
      } else {
        max = 0; // Si falta un recurso, no podemos hacer nada
      }
    });

    return max === Infinity ? 0 : max;
  }

  getResourceIcon(type: string): string {
    const icons: any = { 'wood': '🌲', 'iron': '⛏️', 'silicon': '💠' };
    return icons[type] || '❓';
  }

  // Métodos para Vender
  sellOne() { this.game.sellProduct(this.product.id, 1); }
  sellTen() { this.game.sellProduct(this.product.id, 10); }
  sellAll() { this.game.sellProduct(this.product.id, -1); }

  // Métodos para Fabricar
  craftOne() { this.game.craftProduct(this.product.id, 1); }
  craftTen() { this.game.craftProduct(this.product.id, 10); }
  craftAll() { this.game.craftProduct(this.product.id, -1); }
}