import type { HammerItem } from '../types/miniatures';

export const PRODUCTOS_MOCK: HammerItem[] = [
  {
    id: '1',
    tipo: 'VENTA',
    titulo: 'Guerrero del Caos - Edición Limitada',
    autor: 'Archaon_Paints',
    imagen: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=300',
    categoria: 'Fantasía',
    precio: 50,
    stock: 1
  },
  {
    id: '2',
    tipo: 'MECENAZGO',
    titulo: 'Dragon ancestral - Proyecto de Esculpido',
    autor: 'ForgeMaster',
    imagen: 'https://images.unsplash.com/photo-1558444479-2706fa58b8ec?q=80&w=300',
    categoria: 'Fantasía',
    meta: 5000,
    recaudado: 3200,
    fechaFin: '2026-05-30'
  }
];