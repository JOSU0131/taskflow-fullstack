import { useProductos } from '../hooks/useProductos';
import { GridProductos } from '../components/GridProductos';
import type { Categoria } from '../types/miniatures';

export default function Home() {
  const { 
    productosFiltrados, 
    categoriaSeleccionada, 
    setCategoriaSeleccionada, 
    estaCargando 
  } = useProductos();

  const categorias: Categoria[] = ['Fantasía', 'Bustos', 'Monstruos', 'Tutorial Pintado'];

  return (
    <>
      {/* BARRA DE FILTROS */}
      <div className="flex flex-wrap gap-3 mt-8 mb-12">
        <button 
          onClick={() => setCategoriaSeleccionada(null)}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!categoriaSeleccionada ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          Todos
        </button>
        {categorias.map(cat => (
          <button 
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${categoriaSeleccionada === cat ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {estaCargando ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold animate-pulse">FORJANDO MINIATURAS...</p>
        </div>
      ) : (
        <GridProductos items={productosFiltrados} />
      )}
    </>
  );
}