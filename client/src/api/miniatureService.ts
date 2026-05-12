// src/api/miniatureService.ts
// Cliente de API tipado. Toda comunicación frontend ↔ backend pasa por aquí.

import type { HammerItem, HammerItemSinId } from '../types/miniatures';
import { ApiError, type ApiErrorBody } from '../types/api';

// VITE_API_URL se define en .env.local (dev: http://localhost:4000) o en
// Vercel (vacío → mismo origen). Si no existe, asumimos mismo origen.
const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const API_URL = `${BASE_URL}/api/miniatures`;

/**
 * Helper para procesar la respuesta de fetch y lanzar ApiError si no es 2xx.
 * Centralizar esto evita repetir el mismo if (!response.ok) en cada método.
 */
async function processResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }
  // Intentamos leer el cuerpo del error (puede o no ser JSON)
  let body: ApiErrorBody | null = null;
  try {
    body = await response.json();
  } catch {
    // El backend no devolvió JSON; usaremos solo el status
  }
  const msg = body?.message ?? `Error ${response.status} ${response.statusText}`;
  throw new ApiError(response.status, msg, body);
}

export const miniatureService = {
  // GET /api/miniatures
  getAllMiniatures: async (): Promise<HammerItem[]> => {
    const response = await fetch(API_URL);
    return processResponse<HammerItem[]>(response);
  },

  // GET /api/miniatures/:id
  getById: async (id: string): Promise<HammerItem> => {
    const response = await fetch(`${API_URL}/${id}`);
    return processResponse<HammerItem>(response);
  },

  // POST /api/miniatures
  create: async (mini: HammerItemSinId): Promise<HammerItem> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mini),
    });
    return processResponse<HammerItem>(response);
  },

  // PUT /api/miniatures/:id
  update: async (id: string, mini: Partial<Omit<HammerItem, 'id'>>): Promise<HammerItem> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mini),
    });
    return processResponse<HammerItem>(response);
  },

  // DELETE /api/miniatures/:id
  delete: async (id: string): Promise<{ message: string; id: string }> => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return processResponse<{ message: string; id: string }>(response);
  },
};
