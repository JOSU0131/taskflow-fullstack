
export type Categoria = 
  | 'Fantasía' 
  | 'Bustos' 
  | 'WIPS' 
  | 'Monstruos' 
  | 'Tutorial Pintado'  // Nueva
  | 'Tutorial Esculpido' // Nueva
  | 'Otros';

interface BaseItem {
  id: string;
  titulo: string;
  autor: string;
  imagen: string;
  categoria: Categoria;
}

export interface ItemVenta extends BaseItem {
  tipo: 'VENTA';
  precio: number;
  stock: number;
}

export interface ItemMecenazgo extends BaseItem {
  tipo: 'MECENAZGO';
  meta: number;
  recaudado: number;
  fechaFin: string; // ISO string para Luxon
}

export interface ItemTutorial extends BaseItem {
  tipo: 'TUTORIAL';
  precio: number;
  duracion: string; // Ej: "45 min"
  nivel: 'Básico' | 'Intermedio'| 'Avanzado';
}

// La Unión Discriminada que hace magia
export type HammerItem = ItemVenta | ItemMecenazgo| ItemTutorial;