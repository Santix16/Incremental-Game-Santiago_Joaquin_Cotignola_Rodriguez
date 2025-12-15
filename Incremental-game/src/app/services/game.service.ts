import { Injectable, signal, WritableSignal, computed, effect } from '@angular/core';
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
    // 1. Intentar cargar partida guardada al iniciar
    this.loadGame();

    // 2. El corazón del juego: Late cada 100ms
    setInterval(() => this.gameLoop(), 100);

    // 3. Auto-Guardado: Guardar cada 5 segundos para asegurar persistencia
    setInterval(() => this.saveGame(), 5000);
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

  // --- PERSISTENCIA DE DATOS (NUEVO) ---

  saveGame() {
    const saveObject = {
      money: this._money(),
      resources: this._resources(),
      workers: this._workers(),
      products: this._products()
    };
    localStorage.setItem('tycoon_save_v1', JSON.stringify(saveObject));
    console.log('Juego guardado automáticamente');
  }

  loadGame() {
    const savedData = localStorage.getItem('tycoon_save_v1');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Restauramos los valores si existen en el guardado
        if (parsed.money !== undefined) this._money.set(parsed.money);
        if (parsed.resources) this._resources.set(parsed.resources);
        if (parsed.workers) this._workers.set(parsed.workers);
        if (parsed.products) this._products.set(parsed.products);
        
        console.log('Progreso restaurado con éxito');
      } catch (e) {
        console.error('Error al cargar la partida:', e);
      }
    }
  }

  // Método para reiniciar partida (Útil para configuración)
  resetGame() {
    localStorage.removeItem('tycoon_save_v1');
    location.reload();
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
          if (Math.random() > 0.98) this.sound.click(); 
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
    this.saveGame(); // Guardar al interactuar manualmente también es buena idea
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
      this.saveGame();
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
      this.saveGame();
    }
  }

  // Fabricar Producto (Actualizado para cantidades)
  craftProduct(productId: number, amount: number = 1) {
    const products = this._products();
    const product = products.find(p => p.id === productId);
    const resources = this._resources();

    if (!product) return;

    // Calcular cuántos podemos fabricar como máximo
    let maxCraftable = Infinity;
    product.cost.forEach(req => {
      const res = resources.find(r => r.type === req.type);
      if (res) {
        const canMake = Math.floor(res.amount / req.amount);
        if (canMake < maxCraftable) maxCraftable = canMake;
      } else {
        maxCraftable = 0;
      }
    });

    // Determinar cantidad a fabricar
    const amountToCraft = (amount === -1) ? maxCraftable : Math.min(amount, maxCraftable);

    if (amountToCraft > 0) {
      // Consumir recursos
      product.cost.forEach(req => {
        const res = resources.find(r => r.type === req.type);
        if (res) res.amount -= (req.amount * amountToCraft);
      });
      
      product.stock += amountToCraft;
      this.sound.upgrade(); // Reutilizo sonido
      
      this._resources.set([...resources]);
      this._products.set([...products]);
      this.saveGame();
    }
  }

  // Vender Producto (Actualizado para cantidades)
  sellProduct(productId: number, amount: number = 1) {
    const products = this._products();
    const product = products.find(p => p.id === productId);
    
    if (product && product.stock > 0) {
      // Si amount es -1, vende todo (Max)
      // Si amount es mayor que stock, vende lo que haya
      const amountToSell = (amount === -1 || amount > product.stock) ? product.stock : amount;

      if (amountToSell > 0) {
        product.stock -= amountToSell;
        this._money.update(m => m + (product.sellPrice * amountToSell));
        this.sound.click(); // Sonido de dinero
        this._products.set([...products]);
        this.saveGame();
      }
    }
  }
}