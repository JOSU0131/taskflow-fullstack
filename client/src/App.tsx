import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useProductos } from './hooks/useProductos';
import { GridProductos } from './components/GridProductos';
import type { Categoria } from './types/miniatures';
import NotFound from './pages/NotFound';

function App() {
  // Extraemos todo lo necesario de nuestro Custom Hook
  const { 
    productosFiltrados, 
    categoriaSeleccionada, 
    setCategoriaSeleccionada, 
    estaCargando 
  } = useProductos();

  // Lista de categorías únicas para los botones
  const categorias: Categoria[] = ['Fantasía', 'Bustos', 'Monstruos', 'Tutorial Pintado'];


  return (
  <Router> {/* 1. Envolvemos todo */}
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">

      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-white italic">
          HAMMER<span className="text-orange-500">FLOW</span> FORGE
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          El mercado definitivo para artistas de miniaturas y wargames.
        </p>
      </header>

    <main className="max-w-7xl mx-auto">
      <Routes> {/* 2. Definimos nuestras rutas */}

        {/* Ruta Principal - Grid de Productos/ Contenido PRINCIPAL */}
        <Route path="/" element={
          <>
          {/* BARRA DE FILTROS / (dentro de la Home) */}
          <div className="flex flex-wrap gap-3 mt-8">
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
          /* PANTALLA DE CARGA */
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-500 font-bold animate-pulse">FORJANDO MINIATURAS...</p>
            </div>
          ) : (
            <GridProductos items={productosFiltrados} />
          )}
          </>
        } />

        {/* Otras rutas podrían ir aquí */}
        {/* NUEVA RUTA: Detalle del producto (por ahora vacía) */}
        <Route path="/producto/:id" element={
            <div className="text-center py-20 text-xl text-orange-500 font-bold">
              Cargando datos del guerrero...
            </div>
        } />

        {/* RUTA 404 - NOT FOUND (Captura cualquier ruta no definida) */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </main>

    <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
      &copy; {new Date().getFullYear()} HammerFlow Forge - Panel de Control de Artista
    </footer>
    </div>
    
  </Router>
  );
}

export default App;