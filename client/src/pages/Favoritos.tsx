// src/pages/Favoritos.tsx
// Lista las miniaturas marcadas como favoritas. Reusa los mismos
// componentes y servicios que la galería.

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { miniatureService } from '../api/miniatureService';
import { useFavoritosContext } from '../hooks/useFavoritosContext';
import type { HammerItem } from '../types/miniatures';
import { GridProductos } from '../components/GridProductos';
import { SkeletonGrid } from '../components/SkeletonCard';

export default function Favoritos() {
  const { favoritos, limpiarFavoritos } = useFavoritosContext();
  const [todos, setTodos] = useState<HammerItem[]>([]);
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtener = async () => {
      try {
        setEstaCargando(true);
        const data = await miniatureService.getAllMiniatures();
        setTodos(data);
      } catch {
        setError('No se pudo cargar la lista de productos.');
      } finally {
        setEstaCargando(false);
      }
    };
    obtener();
  }, []);

  // Filtramos solo los items cuyo id está en favoritos
  const items = useMemo(
    () => todos.filter((p) => favoritos.includes(p.id)),
    [todos, favoritos]
  );

  return (
    <section>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
            Tus <span className="text-orange-500">favoritos</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {favoritos.length === 0
              ? 'Todavía no has guardado nada.'
              : `${favoritos.length} pieza${favoritos.length === 1 ? '' : 's'} en tu colección.`}
          </p>
        </div>
        {favoritos.length > 0 && (
          <button
            type="button"
            onClick={limpiarFavoritos}
            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors"
          >
            Limpiar todo
          </button>
        )}
      </div>

      {estaCargando && <SkeletonGrid count={4} />}

      {!estaCargando && error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-6 rounded-xl text-center">
          {error}
        </div>
      )}

      {!estaCargando && !error && favoritos.length === 0 && (
        <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
          <p className="text-4xl mb-3">💔</p>
          <p className="text-slate-300 font-bold">Aún no has guardado favoritos</p>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Pulsa el corazón en cualquier pieza de la galería para guardarla aquí.
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-3
              rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
          >
            Explorar la galería
          </Link>
        </div>
      )}

      {!estaCargando && !error && items.length > 0 && <GridProductos items={items} />}

      {!estaCargando && !error && favoritos.length > 0 && items.length === 0 && (
        <div className="text-center py-12 text-slate-500 text-sm">
          Las piezas que guardaste ya no están disponibles en la galería.
        </div>
      )}
    </section>
  );
}
