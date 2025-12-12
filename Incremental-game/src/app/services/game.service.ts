import { Injectable, signal, WritableSignal, computed } from '@angular/core';
import { GameState } from '../interfaces/game-state';
import { Resource, ResourceType } from '../interfaces/resource';
import { WorkerUnit } from '../interfaces/worker';
import { Product } from '../interfaces/product';
import { SoundService } from './sound.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  // Estado con Signals
  private _money = signal(100); // Capital inicial
  
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

  constructor(private sound: SoundService) {
    // El corazón del juego: Late cada 100ms
    setInterval(() => this.gameLoop(), 100);
  }

  // Exponer el estado
  state(): GameState {
    return {
      money: this._money,
      resources: this._resources,
      workers: this._workers,
      products: this._products
    };
  }

  // --- LÓGICA AUTOMÁTICA ---
  private gameLoop() {
    const now = Date.now();
    let resourcesChanged = false;
    const currentResources = this._resources(); // Copia referencia
    const currentWorkers = this._workers();

    currentWorkers.forEach(worker => {
      // Si hay trabajadores y ya pasó su tiempo de producción
      if (worker.count > 0 && now - worker.lastWorked >= worker.speedMs) {
        const resource = currentResources.find(r => r.type === worker.targetResource);
        if (resource) {
          resource.amount += (worker.baseProduction * worker.count);
          worker.lastWorked = now;
          resourcesChanged = true;
          
          // Efecto de sonido aleatorio (para no saturar)
          if (Math.random() > 0.95) this.sound.click(); 
        }
      }
    });

    // Solo actualizamos la señal si hubo cambios (rendimiento)
    if (resourcesChanged) {
      this._resources.set([...currentResources]);
    }
  }

  // --- ACCIONES DEL JUGADOR ---

  // Recolección manual de emergencia (cuando no tienes trabajadores)
  manualGather(type: ResourceType) {
    this._resources.update(res => res.map(r => 
      r.type === type ? { ...r, amount: r.amount + 1 } : r
    ));
    this.sound.click();
  }

  // Contratar nuevo empleado
  hireWorker(workerId: number) {
    const workers = this._workers();
    const worker = workers.find(w => w.id === workerId);
    
    if (worker && this._money() >= worker.hireCost) {
      this._money.update(m => m - worker.hireCost);
      
      // Mutamos el objeto localmente y luego actualizamos la señal
      worker.count++;
      worker.hireCost = Math.floor(worker.hireCost * 1.5); // Inflación del 50%
      
      this.sound.upgrade();
      this._workers.set([...workers]); // Disparamos actualización
    }
  }

  // Mejorar eficiencia
  upgradeWorker(workerId: number) {
    const workers = this._workers();
    const worker = workers.find(w => w.id === workerId);
    
    if (worker && this._money() >= worker.upgradeCost) {
      this._money.update(m => m - worker.upgradeCost);
      
      worker.baseProduction++;
      worker.speedMs = Math.max(500, worker.speedMs - 200); // Mínimo 0.5s
      worker.upgradeCost = Math.floor(worker.upgradeCost * 2); // Inflación x2
      
      this.sound.upgrade();
      this._workers.set([...workers]);
    }
  }

  // Fabricar Producto
  craftProduct(productId: number) {
    const products = this._products();
    const product = products.find(p => p.id === productId);
    const resources = this._resources();

    if (!product) return;

    // Verificar costes
    const canCraft = product.cost.every(req => {
      const res = resources.find(r => r.type === req.type);
      return res && res.amount >= req.amount;
    });

    if (canCraft) {
      // Consumir recursos
      product.cost.forEach(req => {
        const res = resources.find(r => r.type === req.type);
        if (res) res.amount -= req.amount;
      });
      
      product.stock++;
      this.sound.upgrade(); // Reutilizo sonido upgrade como sonido de craft
      
      this._resources.set([...resources]);
      this._products.set([...products]);
    }
  }

  // Vender Producto
  sellProduct(productId: number) {
    const products = this._products();
    const product = products.find(p => p.id === productId);
    
    if (product && product.stock > 0) {
      product.stock--;
      this._money.update(m => m + product.sellPrice);
      this.sound.click(); // Sonido de dinero
      this._products.set([...products]);
    }
  }
}