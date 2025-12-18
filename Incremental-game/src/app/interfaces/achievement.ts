export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  conditionType: 'resource' | 'money' | 'worker' | 'product'; // Tipo de condición
  targetId?: string | number; // ID del recurso/trabajador (si aplica)
  threshold: number; // Cantidad necesaria
}