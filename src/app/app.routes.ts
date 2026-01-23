import { Routes } from '@angular/router';
import { Menu } from './views/menu/menu';
import { Game } from './views/game/game';
import { Shop } from './views/shop/shop';
import { Settings } from './views/settings/settings';
import { Stats } from './views/stats/stats';
import { Credits } from './views/credits/credits';
import { Login } from './views/login/login';
import { Register } from './views/register/register';

export const routes: Routes = [
  { path: '', component: Menu },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'game', component: Game },
  { path: 'shop', component: Shop },
  { path: 'settings', component: Settings },
  { path: 'stats', component: Stats },
  { path: 'credits', component: Credits },
  { path: '**', redirectTo: '' }
];