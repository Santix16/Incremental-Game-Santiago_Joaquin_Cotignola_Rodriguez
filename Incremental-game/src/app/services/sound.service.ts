import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundService {
  click() { new Audio('/assets/click.mp3').play(); }
  upgrade() { new Audio('/assets/upgrade.mp3').play(); }
}

