// src/api/miniatureService.ts
import type { HammerItem } from '../types/miniatures';

const API_URL = '/api/miniatures';

export const miniatureService = {
  // GET: Traer todas las minis
  getAllMiniatures: async (): Promise<HammerItem[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al conectar con la forja');
    return response.json();
  },

  // POST: Crear una nueva
  create: async (mini: Omit<HammerItem, 'id'>): Promise<HammerItem> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mini),
    });
    if (!response.ok) throw new Error('Error al forjar la miniatura');
    return response.json();
  }
};