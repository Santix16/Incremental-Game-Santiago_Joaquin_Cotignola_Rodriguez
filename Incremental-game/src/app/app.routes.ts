import { Routes } from '@angular/router';
import { Menu } from './views/menu/menu';
import { Game } from './views/game/game';
import { Settings } from './views/settings/settings';
import { Credits } from './views/credits/credits';
import { Stats } from './views/stats/stats';
import { Shop } from './views/shop/shop';

export const routes: Routes = [
  { path: '', component: Menu },
  { path: 'game', component: Game },
  { path: 'settings', component: Settings },
  { path: 'credits', component: Credits },
  { path: 'stats', component: Stats },
  { path: 'shop', component: Shop }
];
