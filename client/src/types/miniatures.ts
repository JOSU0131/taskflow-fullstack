// src/types/miniatures.ts
// Modelo de datos del marketplace.
// HammerItem es una UNIÓN DISCRIMINADA: el campo `tipo` permite a TS
// inferir qué propiedades extra tiene cada variante.

export type Categoria =
  | 'Fantasía'
  | 'Bustos'
  | 'WIPS'
  | 'Monstruos'
  | 'Tutorial'
  | 'Tutorial Esculpido'
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
  duracion: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado';
}

// La unión discriminada que hace magia
export type HammerItem = ItemVenta | ItemMecenazgo | ItemTutorial;

/**
 * Helper DISTRIBUTIVO. Aplica Omit a cada miembro de la unión por separado.
 *
 * ¿Por qué? `Omit<HammerItem, 'id'>` colapsa la unión y pierde la
 * relación entre `tipo` y los campos específicos. Con esta versión,
 * TS sigue sabiendo que si tipo='VENTA' debe haber precio y stock.
 */
export type HammerItemSinId = HammerItem extends infer T
  ? T extends HammerItem
    ? Omit<T, 'id'>
    : never
  : never;
