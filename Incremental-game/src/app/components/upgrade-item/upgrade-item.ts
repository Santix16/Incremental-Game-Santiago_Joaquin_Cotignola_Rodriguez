import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-upgrade-item',
  standalone: true,
  templateUrl: './upgrade-item.html'
})
export class UpgradeItem {
  @Input() upgrade: any;

  apply() {
    if(this.upgrade.canBuy()) {
      this.upgrade.buy();
    }
  }
}


