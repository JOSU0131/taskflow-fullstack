// src/api/miniatureService.ts
import type { Miniature, Categoria } from '../types/miniatures';

const API_URL = 'http://localhost:4000/api/miniatures';

export const miniatureService = {
  // Obtener todas las piezas del servidor
  getMiniatures: async (): Promise<Miniature[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al conectar con la forja');
    return response.json();
  },

  // Enviar una nueva pieza al servidor (POST)
  createMiniature: async (mini: Omit<Miniature, 'id'>): Promise<Miniature> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mini),
    });
    if (!response.ok) throw new Error('No se pudo forjar la pieza en el servidor');
    return response.json();
  }
};