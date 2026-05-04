import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useProductos } from './hooks/useProductos';
import { GridProductos } from './components/GridProductos';
import type { Categoria } from './types/miniatures';
import NotFound from './pages/NotFound';
import NuevoProducto from './pages/NuevoProducto';



function App() {
  // Extraemos todo lo necesario de nuestro Custom Hook
  const { 
    productosFiltrados, 
    categoriaSeleccionada, 
    setCategoriaSeleccionada, 
    estaCargando,
    error 
  } = useProductos();

  // Lista de categorías únicas para los botones
  const categorias: Categoria[] = ['Fantasía', 'Bustos', 'Monstruos', 'Tutorial Pintado'];


  return (
  <Router> {/* 1. Envolvemos todo */}
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-orange-500/30">
    {/* NUEVO CONTENEDOR MAESTRO: "ahora manda sobre el tamaño" */}
      <div className="max-w-6xl mx-auto px-6 py-10">

      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-white italic">
          HAMMER<span className="text-orange-500">FLOW</span> FORGE
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          El mercado definitivo para artistas de miniaturas y wargames.
        </p>
      </header>

      <main>
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
        
            {/* --- GESTIÓN DE LOS 3 ESTADOS DE RED (PASO 12) --- */}

            {/* 1. ESTADO DE ERROR */}
            {error && (
              <div className="mt-10 bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-xl text-center">
                <p className="font-black">❌ ERROR EN LA FORJA</p>
                <p className="text-sm opacity-80">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 text-xs underline font-bold"
                >
                  Reintentar conexión
                </button>
              </div>
            )}

            {/* 2. ESTADO DE CARGA */}
            {estaCargando && !error && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-slate-500 font-bold animate-pulse uppercase tracking-widest">
                    Conectando con el servidor...
                  </p>
                </div>
            )}

            {/* 3. ESTADO DE ÉXITO (DATOS) */}
            {!estaCargando && !error && (
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
          <Route path="/nuevo" element={<NuevoProducto />} />

          {/* RUTA 404 - NOT FOUND (Captura cualquier ruta no definida) */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} HammerFlow Forge - Panel de Control de Artista
      </footer>
      </div>
    </div>
    
  </Router>
  );
}

export default App;