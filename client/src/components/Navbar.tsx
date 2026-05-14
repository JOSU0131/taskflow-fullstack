// src/components/Navbar.tsx
// Barra superior con logo, navegación y contador de favoritos.
// El contador escucha al FavoritosContext.

import { useState, useEffect } from 'react'; // [MODO] Añadido useEffect y useState
import { Link, NavLink } from 'react-router-dom';
import { useFavoritosContext } from '../hooks/useFavoritosContext';

const linkBase = 'text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300';
const linkInactivo = 'text-slate-400 hover:text-white hover:scale-105';
const linkActivo = 'text-[#ffcc00] border-b border-[#ffcc00] pb-1';

export const Navbar = () => {
  const { favoritos } = useFavoritosContext();
  
  // [MODO] Estado inicial: oscuro por defecto
  const [isDark, setIsDark] = useState(true);

  // [MODO] Función para alternar el tema y añadir clase al HTML
  useEffect(() => {
    if (isDark) {
      // Si es oscuro, QUITAMOS el modo claro
      document.documentElement.classList.remove('light-mode');
    } else {
      // Si NO es oscuro, AÑADIMOS el modo claro
      document.documentElement.classList.add('light-mode');
    }
  }, [isDark]);
  
  const toggleTheme = () => setIsDark(!isDark);

  return (
    // "sticky top-0" para que flote al bajar. 
    // "bg-black/20" y "backdrop-blur" para el efecto cristal
    <header className="sticky top-0 z-50 w-full bg-black/20 backdrop-blur-md border-b border-white/5 transition-all duration-500">
      <div className="container mx-auto px-6 py-6 flex flex-col items-center gap-6">
        
        {/* [MODO] Botón flotante a la derecha del header para no romper el centrado del logo */}
        <button 
          onClick={toggleTheme}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/10 hover:bg-white/10 transition-all text-xl"
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? '🌙' : '☀️'}
        </button>



        {/* LOGO CENTRADO: Sin todo mayúsculas y con color de marca */}
        <Link to="/" className="group flex flex-col items-center">
          <span className="text-3xl md:text-4xl font-black tracking-tighter text-white italic leading-none transition-transform group-hover:scale-105">
            HammerFlow <span className="text-[#ffcc00]">Forge</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-500 mt-1 group-hover:text-orange-500 transition-colors">
            Digital Sculpture Studio
          </span>
        </Link>

        {/* NAVEGACIÓN CENTRADA: Debajo del logo */}
        <nav className="flex items-center gap-10">
          <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? linkActivo : linkInactivo}`}>
            Galería
          </NavLink>
          
          <NavLink to="/favoritos" className={({ isActive }) => `${linkBase} ${isActive ? linkActivo : linkInactivo} relative`}>
            Favoritos
            {favoritos.length > 0 && (
              <span className="absolute -top-3 -right-5 min-w-4 h-4 bg-[#ffcc00] text-black text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                {favoritos.length}
              </span>
            )}
          </NavLink>

          <NavLink to="/nuevo" className={({ isActive }) => `${linkBase} ${isActive ? linkActivo : linkInactivo}`}>
            Forjar
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
