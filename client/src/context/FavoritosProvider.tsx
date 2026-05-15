// src/context/FavoritosProvider.tsx
// Solo el componente Provider. Envuelve la app y comparte el state de
// favoritos con todos los descendientes a través del Context.

import type { ReactNode } from 'react';
import { useFavoritos } from '../hooks/useFavoritos';
import { FavoritosContext } from './favoritosContext';

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const value = useFavoritos();
  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};
