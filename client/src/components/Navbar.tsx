// src/components/Navbar.tsx
// Barra superior con logo, navegación y contador de favoritos.
// El contador escucha al FavoritosContext.

import { Link, NavLink } from 'react-router-dom';
import { useFavoritosContext } from '../hooks/useFavoritosContext';

const linkBase = 'text-sm font-bold uppercase tracking-widest transition-colors';
const linkInactivo = 'text-slate-400 hover:text-white';
const linkActivo = 'text-orange-500';

export const Navbar = () => {
  const { favoritos } = useFavoritosContext();

  return (
    <header className="mb-8 sticky top-0 z-30 backdrop-blur-md bg-slate-950/70 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-baseline gap-1">
          <span className="text-2xl md:text-3xl font-black tracking-tighter text-white italic">
            HAMMER<span className="text-orange-500">FLOW</span>
          </span>
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-slate-500">
            Forge
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${linkBase} ${isActive ? linkActivo : linkInactivo}`}
          >
            Galería
          </NavLink>
          <NavLink
            to="/favoritos"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActivo : linkInactivo} relative`}
          >
            Favoritos
            {favoritos.length > 0 && (
              <span
                className="absolute -top-2 -right-4 min-w-[18px] h-[18px] px-1
                  bg-orange-500 text-white text-[10px] font-black
                  rounded-full flex items-center justify-center"
              >
                {favoritos.length}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/nuevo"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActivo : linkInactivo} hidden md:inline`}
          >
            Forjar
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
