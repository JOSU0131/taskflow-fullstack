// src/components/Hero.tsx
// Sección principal de bienvenida en la home. Más visual que el header
// mínimo anterior. Apoyado en gradientes Tailwind y blur.

import { Link } from 'react-router-dom';

export const Hero = () => (
  <section
    className="relative overflow-hidden rounded-3xl border border-slate-800
      bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40
      p-10 md:p-16 mb-12"
  >
    {/* "Glow" decorativo difuminado */}
    <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

    <div className="relative max-w-2xl">
      <span className="inline-block text-xs font-bold uppercase tracking-[0.3em] text-orange-500 mb-4">
        El mercado del hobby
      </span>
      <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.95]">
        Compra, financia y <span className="text-orange-500 italic">aprende</span> el arte de las miniaturas.
      </h2>
      <p className="mt-5 text-slate-400 text-base md:text-lg max-w-xl">
        Una sola plataforma para piezas únicas, mecenazgos de artistas
        emergentes y videotutoriales premium. Sin algoritmos raros.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3
            rounded-lg font-bold text-sm uppercase tracking-widest
            transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-orange-500/30"
        >
          Forjar nueva pieza
          <span aria-hidden>→</span>
        </Link>
        <a
          href="#galeria"
          className="inline-flex items-center gap-2 border border-slate-700 hover:border-orange-500 text-slate-200
            px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
        >
          Ver galería
        </a>
      </div>
    </div>
  </section>
);
