import { Injectable, signal, WritableSignal, computed, effect } from '@angular/core';
import { GameState, GameSettings, Difficulty } from '../interfaces/game-state';
import { Resource, ResourceType } from '../interfaces/resource';
import { WorkerUnit } from '../interfaces/worker';
import { Product } from '../interfaces/product';
import { Achievement } from '../interfaces/achievement';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  // --- ESTADO EXISTENTE ---
  private _money = signal(100);
  
  private _resources = signal<Resource[]>([
    { type: 'wood', name: 'Madera', amount: 0, icon: '🌲' },
    { type: 'iron', name: 'Hierro', amount: 0, icon: '⛏️' },
    { type: 'silicon', name: 'Silicio', amount: 0, icon: '💠' },
    { type: 'oil', name: 'Petróleo', amount: 0, icon: '🛢️' },
    { type: 'gold', name: 'Oro', amount: 0, icon: '✨' }
  ]);

  private _workers = signal<WorkerUnit[]>([
    { id: 1, name: 'Leñador', targetResource: 'wood', count: 1, baseProduction: 1, speedMs: 2000, hireCost: 50, upgradeCost: 100, lastWorked: 0 },
    { id: 2, name: 'Minero', targetResource: 'iron', count: 0, baseProduction: 1, speedMs: 3000, hireCost: 150, upgradeCost: 300, lastWorked: 0 },
    { id: 3, name: 'Ingeniero', targetResource: 'silicon', count: 0, baseProduction: 1, speedMs: 5000, hireCost: 500, upgradeCost: 1000, lastWorked: 0 },
    { id: 4, name: 'Perforador', targetResource: 'oil', count: 0, baseProduction: 1, speedMs: 8000, hireCost: 2000, upgradeCost: 4000, lastWorked: 0 },
    { id: 5, name: 'Buscador', targetResource: 'gold', count: 0, baseProduction: 1, speedMs: 12000, hireCost: 5000, upgradeCost: 10000, lastWorked: 0 }
  ]);

  private _products = signal<Product[]>([
    { id: 1, name: 'Silla Básica', cost: [{type: 'wood', amount: 5}], sellPrice: 15, stock: 0, icon: '🪑' },
    { id: 2, name: 'Espada Hierro', cost: [{type: 'wood', amount: 2}, {type: 'iron', amount: 3}], sellPrice: 40, stock: 0, icon: '⚔️' },
    { id: 3, name: 'Microchip', cost: [{type: 'silicon', amount: 4}, {type: 'iron', amount: 1}], sellPrice: 120, stock: 0, icon: '💾' },
    { id: 4, name: 'Combustible', cost: [{type: 'oil', amount: 3}], sellPrice: 250, stock: 0, icon: '⛽' },
    { id: 5, name: 'Anillo Real', cost: [{type: 'gold', amount: 2}, {type: 'iron', amount: 1}], sellPrice: 600, stock: 0, icon: '💍' },
    { id: 6, name: 'Coche Dep.', cost: [{type: 'iron', amount: 50}, {type: 'oil', amount: 20}, {type: 'silicon', amount: 10}], sellPrice: 5000, stock: 0, icon: '🏎️' }
  ]);

  private _settings = signal<GameSettings>({
    volume: 75, sfxEnabled: true, notificationsEnabled: true, powerSavingMode: false, difficulty: 'normal'
  });

  // --- LOGROS AMPLIADOS ---
  private _achievements = signal<Achievement[]>([
    // Fase 1: Inicios
    { id: 'wood_100', name: 'Leñador Novato', description: 'Acumula 100 de Madera', icon: '🌲', unlocked: false, conditionType: 'resource', targetId: 'wood', threshold: 100 },
    { id: 'money_1000', name: 'Primeros Beneficios', description: 'Consigue 1.000 €', icon: '💰', unlocked: false, conditionType: 'money', threshold: 1000 },
    { id: 'workers_10', name: 'Jefe de Equipo', description: 'Contrata a 10 Leñadores', icon: '👷', unlocked: false, conditionType: 'worker', targetId: 1, threshold: 10 },
    
    // Fase 2: Expansión
    { id: 'iron_baron', name: 'Barón del Hierro', description: 'Acumula 500 de Hierro', icon: '⛓️', unlocked: false, conditionType: 'resource', targetId: 'iron', threshold: 500 },
    { id: 'tech_valley', name: 'Silicon Valley', description: 'Acumula 200 de Silicio', icon: '💾', unlocked: false, conditionType: 'resource', targetId: 'silicon', threshold: 200 },
    { id: 'oil_tycoon', name: 'Oro Negro', description: 'Acumula 100 de Petróleo', icon: '🛢️', unlocked: false, conditionType: 'resource', targetId: 'oil', threshold: 100 },
    
    // Fase 3: Riqueza
    { id: 'rich', name: 'Magnate', description: 'Consigue 100.000 €', icon: '🏦', unlocked: false, conditionType: 'money', threshold: 100000 },
    { id: 'gold_rush', name: 'Fiebre del Oro', description: 'Acumula 50 de Oro', icon: '✨', unlocked: false, conditionType: 'resource', targetId: 'gold', threshold: 50 },
    { id: 'millionaire', name: 'Billonario', description: 'Consigue 1.000.000 €', icon: '💎', unlocked: false, conditionType: 'money', threshold: 1000000 },
    
    // Fase 4: Producción
    { id: 'mass_production', name: 'Línea de Montaje', description: 'Ten 50 sillas en stock', icon: '🪑', unlocked: false, conditionType: 'product', targetId: 1, threshold: 50 },
    { id: 'luxury_dealer', name: 'Joyero Real', description: 'Ten 10 Anillos en stock', icon: '💍', unlocked: false, conditionType: 'product', targetId: 5, threshold: 10 },

    // NUEVO LOGRO
    { id: 'oil_sheikh', name: 'Jeque Petrolero', description: 'Acumula 1.000 de Petróleo', icon: '👳', unlocked: false, conditionType: 'resource', targetId: 'oil', threshold: 1000 }
  ]);

  // Señal para notificaciones
  notification = signal<{message: string, icon: string} | null>(null);

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
      settings: this._settings,
      achievements: this._achievements
    };
  }

  get difficultyMultiplier(): number {
    switch(this._settings().difficulty) {
      case 'easy': return 0.8; case 'normal': return 1.0; case 'hard': return 1.5; default: return 1.0;
    }
  }

  updateSettings(changes: Partial<GameSettings>) {
    this._settings.update(current => ({ ...current, ...changes }));
    this.saveGame();
  }

  // --- LÓGICA DE LOGROS Y NOTIFICACIONES ---
  private checkAchievements() {
    const currentAchievements = this._achievements();
    let updated = false;
    
    const nextAchievements = currentAchievements.map(ach => {
      if (ach.unlocked) return ach; // Ya desbloqueado

      let completed = false;
      
      if (ach.conditionType === 'money') {
        if (this._money() >= ach.threshold) completed = true;
      } 
      else if (ach.conditionType === 'resource') {
        const res = this._resources().find(r => r.type === ach.targetId);
        if (res && res.amount >= ach.threshold) completed = true;
      }
      else if (ach.conditionType === 'worker') {
        const worker = this._workers().find(w => w.id === ach.targetId);
        if (worker && worker.count >= ach.threshold) completed = true;
      }
      else if (ach.conditionType === 'product') {
        const product = this._products().find(p => p.id === ach.targetId);
        if (product && product.stock >= ach.threshold) completed = true;
      }

      if (completed) {
        updated = true;
        this.showNotification(`¡Logro Desbloqueado: ${ach.name}!`, ach.icon);
        if (this._settings().sfxEnabled) this.sound.upgrade(); 
        return { ...ach, unlocked: true };
      }
      
      return ach;
    });

    if (updated) {
      this._achievements.set(nextAchievements);
      this.saveGame();
    }
  }

  // --- SISTEMA DE NOTIFICACIONES ---
  private showNotification(message: string, icon: string = '🏆') {
    // Verificamos si están activas
    if (!this._settings().notificationsEnabled) return;

    this.notification.set({ message, icon });
    // Ocultar automáticamente después de 4 segundos
    setTimeout(() => {
      if (this.notification()?.message === message) {
        this.notification.set(null);
      }
    }, 4000);
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

    if (resourcesChanged) {
      this._resources.set([...currentResources]);
      this.checkAchievements(); // Comprobar logros
    }
  }

  // --- PERSISTENCIA ---
  saveGame() {
    const saveObject = {
      money: this._money(),
      resources: this._resources(),
      workers: this._workers(),
      products: this._products(),
      settings: this._settings(),
      achievements: this._achievements().filter(a => a.unlocked).map(a => a.id)
    };
    localStorage.setItem('tycoon_save_v1', JSON.stringify(saveObject));
  }

  loadGame() {
    const savedData = localStorage.getItem('tycoon_save_v1');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.money !== undefined) this._money.set(parsed.money);
        
        if (parsed.resources) this._resources.set(this.mergeData(this._resources(), parsed.resources, 'type'));
        if (parsed.workers) this._workers.set(this.mergeData(this._workers(), parsed.workers, 'id'));
        if (parsed.products) this._products.set(this.mergeData(this._products(), parsed.products, 'id'));
        
        if (parsed.settings) {
          const currentSettings = this._settings();
          this._settings.set({ ...currentSettings, ...parsed.settings });
        }

        if (parsed.achievements && Array.isArray(parsed.achievements)) {
          const currentAchs = this._achievements();
          const mergedAchs = currentAchs.map(a => ({
            ...a,
            unlocked: parsed.achievements.includes(a.id)
          }));
          this._achievements.set(mergedAchs);
        }
        
      } catch (e) { console.error('Save error', e); }
    }
  }

  private mergeData(current: any[], saved: any[], key: string) {
    return current.map(item => {
      const found = saved.find((s: any) => s[key] === item[key]);
      return found ? { ...item, ...found } : item;
    });
  }

  resetGame() { localStorage.removeItem('tycoon_save_v1'); location.reload(); }
  
  hardReset() { 
    localStorage.removeItem('tycoon_save_v1'); 
    
    // RESTABLECEMOS MANUALMENTE LOS ESTADOS INICIALES EN MEMORIA
    this._money.set(100);
    
    this._resources.set([
      { type: 'wood', name: 'Madera', amount: 0, icon: '🌲' },
      { type: 'iron', name: 'Hierro', amount: 0, icon: '⛏️' },
      { type: 'silicon', name: 'Silicio', amount: 0, icon: '💠' },
      { type: 'oil', name: 'Petróleo', amount: 0, icon: '🛢️' },
      { type: 'gold', name: 'Oro', amount: 0, icon: '✨' }
    ]);

    this._workers.set([
      { id: 1, name: 'Leñador', targetResource: 'wood', count: 1, baseProduction: 1, speedMs: 2000, hireCost: 50, upgradeCost: 100, lastWorked: 0 },
      { id: 2, name: 'Minero', targetResource: 'iron', count: 0, baseProduction: 1, speedMs: 3000, hireCost: 150, upgradeCost: 300, lastWorked: 0 },
      { id: 3, name: 'Ingeniero', targetResource: 'silicon', count: 0, baseProduction: 1, speedMs: 5000, hireCost: 500, upgradeCost: 1000, lastWorked: 0 },
      { id: 4, name: 'Perforador', targetResource: 'oil', count: 0, baseProduction: 1, speedMs: 8000, hireCost: 2000, upgradeCost: 4000, lastWorked: 0 },
      { id: 5, name: 'Buscador', targetResource: 'gold', count: 0, baseProduction: 1, speedMs: 12000, hireCost: 5000, upgradeCost: 10000, lastWorked: 0 }
    ]);

    this._products.set([
      { id: 1, name: 'Silla Básica', cost: [{type: 'wood', amount: 5}], sellPrice: 15, stock: 0, icon: '🪑' },
      { id: 2, name: 'Espada Hierro', cost: [{type: 'wood', amount: 2}, {type: 'iron', amount: 3}], sellPrice: 40, stock: 0, icon: '⚔️' },
      { id: 3, name: 'Microchip', cost: [{type: 'silicon', amount: 4}, {type: 'iron', amount: 1}], sellPrice: 120, stock: 0, icon: '💾' },
      { id: 4, name: 'Combustible', cost: [{type: 'oil', amount: 3}], sellPrice: 250, stock: 0, icon: '⛽' },
      { id: 5, name: 'Anillo Real', cost: [{type: 'gold', amount: 2}, {type: 'iron', amount: 1}], sellPrice: 600, stock: 0, icon: '💍' },
      { id: 6, name: 'Coche Dep.', cost: [{type: 'iron', amount: 50}, {type: 'oil', amount: 20}, {type: 'silicon', amount: 10}], sellPrice: 5000, stock: 0, icon: '🏎️' }
    ]);

    this._achievements.update(achs => achs.map(a => ({...a, unlocked: false})));
    
    // AHORA guardamos el estado limpio
    this.saveGame();
    location.reload();
  }

  // --- ACCIONES ---
  manualGather(type: ResourceType) {
    this._resources.update(res => res.map(r => r.type === type ? { ...r, amount: r.amount + 1 } : r));
    if (this._settings().sfxEnabled) this.sound.click();
    this.checkAchievements();
    this.saveGame();
  }
  
  hireWorker(workerId: number) { 
    const workers = this._workers();
    const worker = workers.find(w => w.id === workerId);
    if (!worker) return;
    const effectiveCost = Math.floor(worker.hireCost * this.difficultyMultiplier);
    if (this._money() >= effectiveCost) {
      this._money.update(m => m - effectiveCost);
      worker.count++;
      worker.hireCost = Math.floor(worker.hireCost * 1.5);
      if (this._settings().sfxEnabled) this.sound.upgrade();
      this._workers.set([...workers]);
      this.checkAchievements();
      this.saveGame();
    }
  }
  
  upgradeWorker(workerId: number) {
     const workers = this._workers();
     const worker = workers.find(w => w.id === workerId);
     if (!worker || worker.speedMs <= 500) return;
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
    const multiplier = this.difficultyMultiplier;
    const getEffectiveReqAmount = (baseAmount: number) => Math.ceil(baseAmount * multiplier);
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
      product.cost.forEach(req => {
        const res = resources.find(r => r.type === req.type);
        if (res) res.amount -= (getEffectiveReqAmount(req.amount) * amountToCraft);
      });
      product.stock += amountToCraft;
      if (this._settings().sfxEnabled) this.sound.upgrade();
      this._resources.set([...resources]);
      this._products.set([...products]);
      this.checkAchievements(); 
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
        this.checkAchievements();
        this.saveGame();
      }
    }
  }
}