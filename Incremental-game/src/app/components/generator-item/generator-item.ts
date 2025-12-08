import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Generator } from '../../interfaces/generator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generator-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generator-item.html'
})
export class GeneratorItem {
  @Input() generator!: Generator;

  @Output() buyGenerator = new EventEmitter<Generator>();

  buy() {
    this.buyGenerator.emit(this.generator);
  }
}


