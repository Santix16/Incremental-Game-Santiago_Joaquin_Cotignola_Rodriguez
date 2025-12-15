import { Injectable, signal, WritableSignal, computed, effect } from '@angular/core';
import { GameState, GameSettings } from '../interfaces/game-state';
import { Resource, ResourceType } from '../interfaces/resource';
import { WorkerUnit } from '../interfaces/worker';
import { Product } from '../interfaces/product';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  // --- ESTADO DEL JUEGO ---
  private _money = signal(100);
  
  private _resources = signal<Resource[]>([
    { type: 'wood', name: 'Madera', amount: 0, icon: '🌲' },
    { type: 'iron', name: 'Hierro', amount: 0, icon: '⛏️' },
    { type: 'silicon', name: 'Silicio', amount: 0, icon: '💠' }
  ]);

  private _workers = signal<WorkerUnit[]>([
    { id: 1, name: 'Leñador', targetResource: 'wood', count: 1, baseProduction: 1, speedMs: 2000, hireCost: 50, upgradeCost: 100, lastWorked: 0 },
    { id: 2, name: 'Minero', targetResource: 'iron', count: 0, baseProduction: 1, speedMs: 3000, hireCost: 150, upgradeCost: 300, lastWorked: 0 },
    { id: 3, name: 'Ingeniero', targetResource: 'silicon', count: 0, baseProduction: 1, speedMs: 5000, hireCost: 500, upgradeCost: 1000, lastWorked: 0 }
  ]);

  private _products = signal<Product[]>([
    { id: 1, name: 'Silla Básica', cost: [{type: 'wood', amount: 5}], sellPrice: 15, stock: 0, icon: '🪑' },
    { id: 2, name: 'Espada Hierro', cost: [{type: 'wood', amount: 2}, {type: 'iron', amount: 3}], sellPrice: 40, stock: 0, icon: '⚔️' },
    { id: 3, name: 'Chip', cost: [{type: 'silicon', amount: 4}, {type: 'iron', amount: 1}], sellPrice: 120, stock: 0, icon: '💾' }
  ]);

  // --- NUEVO: ESTADO DE CONFIGURACIÓN ---
  private _settings = signal<GameSettings>({
    volume: 75,
    sfxEnabled: true,
    notificationsEnabled: true,
    powerSavingMode: false
  });

  constructor(private sound: SoundService) {
    this.loadGame(); // Cargar al inicio
    setInterval(() => this.gameLoop(), 100);
    setInterval(() => this.saveGame(), 5000); // Auto-guardado
  }

  state(): GameState {
    return {
      money: this._money,
      resources: this._resources,
      workers: this._workers,
      products: this._products,
      settings: this._settings // Exponemos la configuración
    };
  }

  // --- MÉTODOS DE ACTUALIZACIÓN DE SETTINGS ---
  updateSettings(changes: Partial<GameSettings>) {
    this._settings.update(current => ({ ...current, ...changes }));
    this.saveGame(); // Guardar inmediatamente al cambiar opciones
  }

  // --- PERSISTENCIA ---
  saveGame() {
    const saveObject = {
      money: this._money(),
      resources: this._resources(),
      workers: this._workers(),
      products: this._products(),
      settings: this._settings() // <-- Guardamos configuración
    };
    localStorage.setItem('tycoon_save_v1', JSON.stringify(saveObject));
    // console.log('Guardado');
  }

  loadGame() {
    const savedData = localStorage.getItem('tycoon_save_v1');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.money !== undefined) this._money.set(parsed.money);
        if (parsed.resources) this._resources.set(parsed.resources);
        if (parsed.workers) this._workers.set(parsed.workers);
        if (parsed.products) this._products.set(parsed.products);
        if (parsed.settings) this._settings.set(parsed.settings); // <-- Cargamos configuración
        
        console.log('Juego cargado correctamente');
      } catch (e) {
        console.error('Save corrupto', e);
      }
    }
  }

  resetGame() {
    localStorage.removeItem('tycoon_save_v1');
    location.reload();
  }

  // --- LÓGICA DE JUEGO (GAME LOOP) ---
  private gameLoop() {
    const now = Date.now();
    let resourcesChanged = false;
    const currentResources = this._resources();
    const currentWorkers = this._workers();

    currentWorkers.forEach(worker => {
      if (worker.count > 0 && now - worker.lastWorked >= worker.speedMs) {
        const resource = currentResources.find(r => r.type === worker.targetResource);
        if (resource) {
          resource.amount += (worker.baseProduction * worker.count);
          worker.lastWorked = now;
          resourcesChanged = true;
          
          // Usar configuración para reproducir sonido
          if (this._settings().sfxEnabled && Math.random() > 0.98) {
             this.sound.click(); 
          }
        }
      }
    });

    if (resourcesChanged) {
      this._resources.set([...currentResources]);
    }
  }

  // --- ACCIONES ---
  manualGather(type: ResourceType) {
    this._resources.update(res => res.map(r => r.type === type ? { ...r, amount: r.amount + 1 } : r));
    if (this._settings().sfxEnabled) this.sound.click();
    this.saveGame();
  }

  hireWorker(workerId: number) {
    const workers = this._workers();
    const worker = workers.find(w => w.id === workerId);
    if (worker && this._money() >= worker.hireCost) {
      this._money.update(m => m - worker.hireCost);
      worker.count++;
      worker.hireCost = Math.floor(worker.hireCost * 1.5);
      if (this._settings().sfxEnabled) this.sound.upgrade();
      this._workers.set([...workers]);
      this.saveGame();
    }
  }

  upgradeWorker(workerId: number) {
    const workers = this._workers();
    const worker = workers.find(w => w.id === workerId);
    if (worker && this._money() >= worker.upgradeCost) {
      this._money.update(m => m - worker.upgradeCost);
      worker.baseProduction++;
      worker.speedMs = Math.max(500, worker.speedMs - 200);
      worker.upgradeCost = Math.floor(worker.upgradeCost * 2);
      if (this._settings().sfxEnabled) this.sound.upgrade();
      this._workers.set([...workers]);
      this.saveGame();
    }
  }

  craftProduct(productId: number, amount: number = 1) {
    const products = this._products();
    const product = products.find(p => p.id === productId);
    const resources = this._resources();
    if (!product) return;

    let maxCraftable = Infinity;
    product.cost.forEach(req => {
      const res = resources.find(r => r.type === req.type);
      if (res) {
        const canMake = Math.floor(res.amount / req.amount);
        if (canMake < maxCraftable) maxCraftable = canMake;
      } else { maxCraftable = 0; }
    });

    const amountToCraft = (amount === -1) ? maxCraftable : Math.min(amount, maxCraftable);

    if (amountToCraft > 0) {
      product.cost.forEach(req => {
        const res = resources.find(r => r.type === req.type);
        if (res) res.amount -= (req.amount * amountToCraft);
      });
      product.stock += amountToCraft;
      if (this._settings().sfxEnabled) this.sound.upgrade();
      this._resources.set([...resources]);
      this._products.set([...products]);
      this.saveGame();
    }
  }

  sellProduct(productId: number, amount: number = 1) {
    const products = this._products();
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
      const amountToSell = (amount === -1 || amount > product.stock) ? product.stock : amount;
      if (amountToSell > 0) {
        product.stock -= amountToSell;
        this._money.update(m => m + (product.sellPrice * amountToSell));
        if (this._settings().sfxEnabled) this.sound.click();
        this._products.set([...products]);
        this.saveGame();
      }
    }
  }
}