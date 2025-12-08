import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pause-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pause-confirm.html'
})
export class PauseConfirm {
  @Input() show = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.show = false;
  }

  onCancel() {
    this.cancel.emit();
    this.show = false;
  }
}
