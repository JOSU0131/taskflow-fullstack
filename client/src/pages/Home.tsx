// src/pages/Home.tsx
// Página principal: Hero + Buscador + Filtros + Grid de productos.
// Maneja los 3 estados de red: cargando, error, datos.

import { useProductos } from '../hooks/useProductos';
import type { Categoria } from '../types/miniatures';
import { Hero } from '../components/Hero';
import { Buscador } from '../components/Buscador';
import { GridProductos } from '../components/GridProductos';
import { SkeletonGrid } from '../components/SkeletonCard';

const CATEGORIAS: Categoria[] = ['Fantasía', 'Bustos', 'Monstruos', 'Tutorial Pintado'];

export default function Home() {
  const {
    productosFiltrados,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    busqueda,
    setBusqueda,
    estaCargando,
    error,
  } = useProductos();

  return (
    <>
      <Hero />

      <section id="galeria" className="scroll-mt-24">
        {/* Cabecera de la galería */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Galería de la Forja
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Filtra por categoría o busca por título / autor.
            </p>
          </div>
          <Buscador valor={busqueda} onCambio={setBusqueda} />
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all
              ${!categoriaSeleccionada
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Todos
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all
                ${categoriaSeleccionada === cat
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* === ESTADOS DE RED === */}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-6 rounded-xl text-center">
            <p className="font-black uppercase tracking-widest">❌ Error en la forja</p>
            <p className="text-sm opacity-80 mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-xs underline font-bold hover:text-red-300"
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {estaCargando && !error && <SkeletonGrid count={8} />}

        {!estaCargando && !error && productosFiltrados.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-700 rounded-xl">
            <p className="text-2xl">🔍</p>
            <p className="mt-3 text-slate-300 font-bold">Ningún resultado coincide con tu búsqueda</p>
            <p className="text-sm text-slate-500 mt-1">Prueba con otra categoría o limpia el filtro.</p>
          </div>
        )}

        {!estaCargando && !error && productosFiltrados.length > 0 && (
          <GridProductos items={productosFiltrados} />
        )}
      </section>
    </>
  );
}
