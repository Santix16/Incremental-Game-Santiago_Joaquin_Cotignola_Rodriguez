import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class SaveService {
  constructor(private http: HttpClient, private game: GameService) {}

  save(userId: number) {
    const state = {
      money: this.game.state().money(),
      resources: this.game.state().resources(),
      workers: this.game.state().workers(),
      products: this.game.state().products()
    };
    // Guardamos en localStorage para evitar errores si no hay backend
    localStorage.setItem(`save_${userId}`, JSON.stringify(state));
    console.log('Partida guardada', state);
    
    // Si tuvieras backend real:
    // return this.http.post(`http://localhost:3000/save/${userId}`, state).subscribe();
  }

  load(userId: number) {
    // Carga desde localStorage
    const saved = localStorage.getItem(`save_${userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      
      this.game.state().money.set(data.money);
      this.game.state().resources.set(data.resources);
      this.game.state().workers.set(data.workers);
      this.game.state().products.set(data.products);
      
      console.log('Partida cargada');
    }
    
    // Lógica para backend real:
    /*
    this.http.get<any>(`http://localhost:3000/save/${userId}`).subscribe(data => {
      if(data) {
         this.game.state().money.set(data.money);
         // ... resto de asignaciones
      }
    });
    */
  }
}