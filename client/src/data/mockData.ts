import type { HammerItem } from '../types/miniatures';

export const PRODUCTOS_MOCK: HammerItem[] = [
  {
    id: '1',
    tipo: 'VENTA',
    titulo: 'Guerrero del Caos - Edición Limitada',
    autor: 'Archaon_Paints',
    imagen: 'https://images.unsplash.com/photo-1613431812949-77b3351bb23d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWluaWF0dXJlfGVufDB8fDB8fHww',
    categoria: 'Fantasía',
    precio: 50,
    stock: 1
  },
  {
    id: '2',
    tipo: 'MECENAZGO',
    titulo: 'Dragon ancestral - Proyecto de Esculpido',
    autor: 'ForgeMaster',
    imagen: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcREO8WMD_flijDB-e6TMqsrxBu7rAaEDL7RyAh0UGpzqhuevNsX7QhKWGf4Mh7N',
    categoria: 'Fantasía',
    meta: 5000,
    recaudado: 3200,
    fechaFin: '2026-05-30'
  },
{
    id: '3',
    tipo: 'TUTORIAL',
    titulo: 'Tutorial de Pintura Avanzada',
    autor: 'Archaon_Paints',
    imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScJ-2hyv3q-EsXVqKAfPFTaWqXgrKIvKVh52KvD8jAmOpF7ffaMmlqOuknU6SL',
    categoria: 'Tutorial Pintado',
    duracion: '2 horas',
    nivel: 'Intermedio',
    precio: 20
  }
];