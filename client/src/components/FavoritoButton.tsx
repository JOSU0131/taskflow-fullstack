// src/components/FavoritoButton.tsx
// Corazoncito reutilizable. Animado y consciente del Context.

import { useFavoritosContext } from '../hooks/useFavoritosContext';

interface Props {
  id: string;
  /** size en px (default 20) */
  size?: number;
  className?: string;
}

export const FavoritoButton = ({ id, size = 20, className = '' }: Props) => {
  const { esFavorito, toggleFavorito } = useFavoritosContext();
  const activo = esFavorito(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        // Evita que al pulsar el corazón también se navegue (la card
        // entera es un Link).
        e.preventDefault();
        e.stopPropagation();
        toggleFavorito(id);
      }}
      aria-label={activo ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={activo}
      className={`group/fav inline-flex items-center justify-center rounded-full p-2 transition-all duration-200
        ${activo
          ? 'bg-orange-500/20 text-orange-500'
          : 'bg-slate-900/70 text-slate-400 hover:text-orange-400 hover:bg-slate-900'}
        backdrop-blur-md border border-white/10
        active:scale-90 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={activo ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${activo ? 'scale-110' : 'group-hover/fav:scale-110'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};
