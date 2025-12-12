import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-item.html'
})
export class ProductItem {
  @Input() product!: Product;

  constructor(public game: GameService) {}
}