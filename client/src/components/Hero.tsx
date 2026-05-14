// src/components/Hero.tsx
// Sección principal de bienvenida en la home. Más visual que el header
// mínimo anterior. Apoyado en gradientes Tailwind y blur.

import { Link } from 'react-router-dom';

export const Hero = () => (
  <section
    // usamos "w-full min-h-[90vh]" para que cubra toda la pantalla y se adapte a diferentes tamaños.//
    className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
    style={{
      backgroundImage: "url('/hero-highlands.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >

    {/* Velo de oscuridad para que el texto destaque */}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

    <div className="relative z-10 p-6 text-center max-w-5xl">
      <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-[#ffcc00] mb-6 animate-fade-in">
        El mercado definitivo para artistas
      </span>
      
      {/* EL LOGO RETRO: Con perfilado negro y amarillo potente */}
      <h1 
        className="text-6xl md:text-[120px] font-black italic uppercase tracking-tighter leading-[0.8]"
        style={{
          color: '#ffcc00',
          textShadow: '4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 15px 30px rgba(0,0,0,0.7)'
        }}
      >
        HammerFlow <br /> Forge
      </h1>

      <p className="mt-8 text-white text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
        Compra, financia y <span className="text-[#ffcc00] font-bold">aprende</span> el arte de las miniaturas en una sola plataforma.
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <Link
          to="/nuevo"
          className="bg-[#ff6600] hover:bg-[#ff8800] text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl"
        >
          Forjar nueva pieza
        </Link>
        <a
          href="#galeria"
          className="backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-colors"
        >
          Ver galería
        </a>
      </div>
    </div>
  </section>
);

    