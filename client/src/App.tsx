// src/App.tsx
// Punto de entrada lógico de la aplicación.
// Responsabilidades: layout (Navbar + main + footer), routing y providers.
//
// IMPORTANTE: las páginas se cargan con React.lazy (code-splitting). Cada
// página viaja en su propio chunk de JS y solo se descarga cuando la ruta
// se visita. Mejora el First Load.

import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { FavoritosProvider } from './context/FavoritosProvider';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Lazy pages — cada una en su propio bundle
const Home = lazy(() => import('./pages/Home'));
const DetalleProducto = lazy(() => import('./pages/DetalleProducto'));
const NuevoProducto = lazy(() => import('./pages/NuevoProducto'));
const Favoritos = lazy(() => import('./pages/Favoritos'));
const NotFound = lazy(() => import('./pages/NotFound'));

const RouteFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <FavoritosProvider>
      <Router>
        <div className="min-h-screen bg-black text-slate-100 selection:bg-[#ffcc00]/30">
          <Navbar />

          {/* HEMOS QUITADO EL <main> DE AQUÍ. 
              Ahora las rutas están libres.
          */}
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/nuevo" element={<NuevoProducto />} />
              <Route path="/favoritos" element={<Favoritos />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          
          {/* 2. BORRA el footer viejo y pon el nuevo así: */}
          <Footer />
        
        </div>
      </Router>
    </FavoritosProvider>
  );
}

export default App;
