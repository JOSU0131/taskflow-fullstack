// src/hooks/useFavoritosContext.ts
// Hook de consumo del FavoritosContext. Lanza error si se usa fuera del
// Provider para detectar bugs en desarrollo.

import { useContext } from 'react';
import { FavoritosContext, type FavoritosContextValue } from '../context/favoritosContext';

export const useFavoritosContext = (): FavoritosContextValue => {
  const ctx = useContext(FavoritosContext);
  if (!ctx) {
    throw new Error(
      'useFavoritosContext debe usarse dentro de <FavoritosProvider>'
    );
  }
  return ctx;
};
