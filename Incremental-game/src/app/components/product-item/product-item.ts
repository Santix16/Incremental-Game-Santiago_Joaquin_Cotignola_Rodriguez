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

  getReqAmount(baseAmount: number): number {
    return Math.ceil(baseAmount * this.game.difficultyMultiplier);
  }

  canCraft(): boolean {
    const resources = this.game.state().resources();
    return this.product.cost.every(req => {
      const res = resources.find(r => r.type === req.type);
      const needed = this.getReqAmount(req.amount);
      return res ? res.amount >= needed : false;
    });
  }

  maxCraftable(): number {
    const resources = this.game.state().resources();
    let max = Infinity;
    this.product.cost.forEach(req => {
      const res = resources.find(r => r.type === req.type);
      const needed = this.getReqAmount(req.amount);
      if (res) {
        const canMake = Math.floor(res.amount / needed);
        if (canMake < max) max = canMake;
      } else { max = 0; }
    });
    return max === Infinity ? 0 : max;
  }

  getResourceIcon(type: string): string {
    const icons: any = { 
      'wood': '🌲', 
      'iron': '⛏️', 
      'silicon': '💠',
      'oil': '🛢️',
      'gold': '✨' 
    };
    return icons[type] || '❓';
  }

  sellOne() { this.game.sellProduct(this.product.id, 1); }
  sellTen() { this.game.sellProduct(this.product.id, 10); }
  sellAll() { this.game.sellProduct(this.product.id, -1); }

  craftOne() { this.game.craftProduct(this.product.id, 1); }
  craftTen() { this.game.craftProduct(this.product.id, 10); }
  craftAll() { this.game.craftProduct(this.product.id, -1); }
}