import { Injectable, signal, WritableSignal, computed, effect } from '@angular/core';
import { GameState, GameSettings, Difficulty } from '../interfaces/game-state';
import { Resource, ResourceType } from '../interfaces/resource';
import { WorkerUnit } from '../interfaces/worker';
import { Product } from '../interfaces/product';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  // --- ESTADO ---
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

  private _settings = signal<GameSettings>({
    volume: 75,
    sfxEnabled: true,
    difficulty: 'normal' // Valor por defecto
  });

  constructor(private sound: SoundService) {
    this.loadGame();
    setInterval(() => this.gameLoop(), 100);
    setInterval(() => this.saveGame(), 5000);
  }

  state(): GameState {
    return {
      money: this._money,
      resources: this._resources,
      workers: this._workers,
      products: this._products,
      settings: this._settings
    };
  }

  // --- MULTIPLICADOR DE DIFICULTAD ---
  get difficultyMultiplier(): number {
    switch(this._settings().difficulty) {
      case 'easy': return 0.8;   // 20% más barato
      case 'normal': return 1.0; // Estándar
      case 'hard': return 1.5;   // 50% más caro
      default: return 1.0;
    }
  }

  updateSettings(changes: Partial<GameSettings>) {
    this._settings.update(current => ({ ...current, ...changes }));
    this.saveGame();
  }

  // --- PERSISTENCIA ---
  saveGame() {
    const saveObject = {
      money: this._money(),
      resources: this._resources(),
      workers: this._workers(),
      products: this._products(),
      settings: this._settings()
    };
    localStorage.setItem('tycoon_save_v1', JSON.stringify(saveObject));
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
        
        // Migración simple: si la partida guardada es vieja y no tiene difficulty, ponemos normal
        const loadedSettings = parsed.settings || {};
        if (!loadedSettings.difficulty) loadedSettings.difficulty = 'normal';
        this._settings.set(loadedSettings);
        
      } catch (e) { console.error('Save error', e); }
    }
  }

  // Reinicia y recarga la página (útil para fallos graves)
  resetGame() {
    localStorage.removeItem('tycoon_save_v1');
    location.reload();
  }

  // Reinicia el estado en memoria para Nueva Partida (sin recargar)
  hardReset() {
    localStorage.removeItem('tycoon_save_v1');
    
    // Restaurar valores iniciales
    this._money.set(100);
    this._resources.set([
      { type: 'wood', name: 'Madera', amount: 0, icon: '🌲' },
      { type: 'iron', name: 'Hierro', amount: 0, icon: '⛏️' },
      { type: 'silicon', name: 'Silicio', amount: 0, icon: '💠' }
    ]);
    this._workers.set([
      { id: 1, name: 'Leñador', targetResource: 'wood', count: 1, baseProduction: 1, speedMs: 2000, hireCost: 50, upgradeCost: 100, lastWorked: 0 },
      { id: 2, name: 'Minero', targetResource: 'iron', count: 0, baseProduction: 1, speedMs: 3000, hireCost: 150, upgradeCost: 300, lastWorked: 0 },
      { id: 3, name: 'Ingeniero', targetResource: 'silicon', count: 0, baseProduction: 1, speedMs: 5000, hireCost: 500, upgradeCost: 1000, lastWorked: 0 }
    ]);
    this._products.set([
      { id: 1, name: 'Silla Básica', cost: [{type: 'wood', amount: 5}], sellPrice: 15, stock: 0, icon: '🪑' },
      { id: 2, name: 'Espada Hierro', cost: [{type: 'wood', amount: 2}, {type: 'iron', amount: 3}], sellPrice: 40, stock: 0, icon: '⚔️' },
      { id: 3, name: 'Chip', cost: [{type: 'silicon', amount: 4}, {type: 'iron', amount: 1}], sellPrice: 120, stock: 0, icon: '💾' }
    ]);
    
    // No reseteamos settings para no molestar al usuario
    this.saveGame();
  }

  // --- GAME LOOP ---
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
          if (this._settings().sfxEnabled && Math.random() > 0.98) this.sound.click(); 
        }
      }
    });

    if (resourcesChanged) this._resources.set([...currentResources]);
  }

  // --- ACCIONES (Con Costes Ajustados) ---

  manualGather(type: ResourceType) {
    this._resources.update(res => res.map(r => r.type === type ? { ...r, amount: r.amount + 1 } : r));
    if (this._settings().sfxEnabled) this.sound.click();
    this.saveGame();
  }

  hireWorker(workerId: number) {
    const workers = this._workers();
    const worker = workers.find(w => w.id === workerId);
    
    if (!worker) return;

    // Calculamos el coste real basado en la dificultad
    const effectiveCost = Math.floor(worker.hireCost * this.difficultyMultiplier);

    if (this._money() >= effectiveCost) {
      this._money.update(m => m - effectiveCost);
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
    
    if (!worker) return;

    const effectiveCost = Math.floor(worker.upgradeCost * this.difficultyMultiplier);

    if (this._money() >= effectiveCost) {
      this._money.update(m => m - effectiveCost);
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

    // Aplicar dificultad al coste de RECURSOS
    const multiplier = this.difficultyMultiplier;

    // Helper para verificar y consumir
    const getEffectiveReqAmount = (baseAmount: number) => Math.ceil(baseAmount * multiplier);

    // 1. Calcular máximo posible con los costes ajustados
    let maxCraftable = Infinity;
    product.cost.forEach(req => {
      const res = resources.find(r => r.type === req.type);
      const effectiveReq = getEffectiveReqAmount(req.amount);
      if (res) {
        const canMake = Math.floor(res.amount / effectiveReq);
        if (canMake < maxCraftable) maxCraftable = canMake;
      } else { maxCraftable = 0; }
    });

    const amountToCraft = (amount === -1) ? maxCraftable : Math.min(amount, maxCraftable);

    if (amountToCraft > 0) {
      // 2. Consumir
      product.cost.forEach(req => {
        const res = resources.find(r => r.type === req.type);
        if (res) res.amount -= (getEffectiveReqAmount(req.amount) * amountToCraft);
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