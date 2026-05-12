// src/context/favoritosContext.ts
// Solo el createContext y el tipo. Sin componentes ni hooks.
// El Provider está en FavoritosProvider.tsx y el hook en useFavoritosContext.ts.
//
// Esta separación es necesaria para que Fast Refresh de Vite funcione bien:
// la regla `react-refresh/only-export-components` exige que un archivo
// exporte SOLO componentes para poder hot-recargarlo.

import { createContext } from 'react';
import type { useFavoritos } from '../hooks/useFavoritos';

export type FavoritosContextValue = ReturnType<typeof useFavoritos>;

export const FavoritosContext = createContext<FavoritosContextValue | null>(null);
