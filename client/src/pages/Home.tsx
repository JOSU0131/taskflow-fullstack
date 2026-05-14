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
      {/* 1. El Hero ocupa el 100% de ancho (liberado en App.tsx) */}
      <Hero />

      {/* 2. Añadimos este div para centrar el resto del contenido */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        <section id="galeria" className="scroll-mt-24">
          
          {/* Cabecera de la galería más elegante */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
                La Forja de <span className="text-[#ffcc00]">Miniaturas</span>
              </h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Explora las últimas creaciones de HammerFlow Forge.
              </p>
            </div>
            
            <div className="w-full md:w-80">
              <Buscador valor={busqueda} onCambio={setBusqueda} />
            </div>
          </div>

          {/* Filtros estilo Highlands: Sencillos, blancos y con subrayado */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-12 border-b border-white/5 pb-4">
            
            <button
              onClick={() => setCategoriaSeleccionada(null)}
              className={`relative pb-2 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300
                ${!categoriaSeleccionada 
                  ? 'text-[#ffcc00] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffcc00]' 
                  : 'text-slate-400 hover:text-white hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-white/20'}`}
            >
              Todos
            </button>

            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSeleccionada(cat)}
                className={`relative pb-2 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300
                  ${categoriaSeleccionada === cat
                    ? 'text-[#ffcc00] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#ffcc00]' 
                    : 'text-slate-400 hover:text-white hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-0.5 hover:after:bg-white/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* === ESTADOS DE RED === */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-10 rounded-sm text-center">
              <p className="font-black uppercase tracking-[0.3em]">Error en los Sistemas de la Forja</p>
              <button onClick={() => window.location.reload()} className="mt-4 text-xs font-bold underline">Reintentar</button>
            </div>
          )}

          {estaCargando && !error && <SkeletonGrid count={8} />}

          {!estaCargando && !error && productosFiltrados.length === 0 && (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-sm">
              <p className="text-slate-500 font-bold uppercase tracking-widest">Sin resultados en la forja</p>
            </div>
          )}

          {!estaCargando && !error && productosFiltrados.length > 0 && (
            <GridProductos items={productosFiltrados} />
          )}
        </section>
      </div>
    </>
  );
}