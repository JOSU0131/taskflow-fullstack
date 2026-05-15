// src/pages/Galeria.tsx
import { useProductos } from '../hooks/useProductos';
import type { Categoria } from '../types/miniatures';
import { Buscador } from '../components/Buscador';
import { GridProductos } from '../components/GridProductos';
import { SkeletonGrid } from '../components/SkeletonCard';

const CATEGORIAS: Categoria[] = ['Fantasía', 'Bustos', 'Monstruos', 'Tutorial'];

export default function Galeria() {
  const {
    productosFiltrados,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    busqueda,
    setBusqueda,
    estaCargando,
  } = useProductos();

  return (
    <section className="py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          Galería de la Forja
        </h1>
        <p className="text-slate-400 mt-2">Explora las creaciones más imponentes de nuestra comunidad.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-6">
        <div className="flex flex-wrap gap-6">
          <button
            onClick={() => setCategoriaSeleccionada(null)}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${!categoriaSeleccionada ? 'text-[#ffcc00]' : 'text-slate-500 hover:text-white'}`}
          >
            Todos
          </button>
          {CATEGORIAS.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`text-xs font-bold uppercase tracking-widest transition-colors ${categoriaSeleccionada === cat ? 'text-[#ffcc00]' : 'text-slate-500 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Buscador valor={busqueda} onCambio={setBusqueda} />
      </div>

      {estaCargando ? <SkeletonGrid count={8} /> : <GridProductos items={productosFiltrados} />}
    </section>
  );
}