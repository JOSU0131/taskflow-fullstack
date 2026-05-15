// src/hooks/useFavoritos.ts
// Segundo Custom Hook (Bonus). Gestiona los ids favoritos del usuario.
// Persiste en localStorage para que sobrevivan al refresco.
//
// NOTA: SOLO los ids viven en localStorage. Los datos completos siguen
// siendo "fuente de verdad" del backend. Esto evita que se desincronicen
// (si una mini se borra del backend, su id favorito ya no encuentra nada).

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hammer-favoritos';

const leerFavoritos = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
};

export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState<string[]>(() => leerFavoritos());

  // Sincronizamos cualquier cambio con localStorage. Lo envolvemos en try/catch
  // porque en modo privado/incógnito de algunos navegadores setItem puede
  // lanzar (cuota=0). Mejor que la app no muestre datos a que casque.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    } catch {
      // Sin persistencia, los favoritos solo viven en memoria. Aceptable.
    }
  }, [favoritos]);

  const esFavorito = useCallback(
    (id: string) => favoritos.includes(id),
    [favoritos]
  );

  const toggleFavorito = useCallback((id: string) => {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const limpiarFavoritos = useCallback(() => setFavoritos([]), []);

  return { favoritos, esFavorito, toggleFavorito, limpiarFavoritos };
};
