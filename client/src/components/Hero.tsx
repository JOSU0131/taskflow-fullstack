// src/components/Hero.tsx
// Sección principal de bienvenida en la home. Más visual que el header
// mínimo anterior. Apoyado en gradientes Tailwind y blur.

import { Link } from 'react-router-dom';

export const Hero = () => (
  <section
    // usamos "w-full min-h-[90vh]" para que cubra toda la pantalla y se adapte a diferentes tamaños.//
    className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden"
    style={{
      backgroundImage: "url('/hero-hammerflow.jpg')",
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
      
      {/* EL LOGO RETRO: Estilo Fuego con perfilado negro Grueso y amarillo potente */}
      <div className="flex justify-center mb-6">
        <img 
          src="/titulo-hamerflowforge.png" 
          alt="HammerFlow Forge"
          className="w-full max-w-[450px] md:max-w-[900px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
        />
      </div>

      <p className="mt-8 text-white text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed opacity-90">
        Adquiere piezas únicas, <span className="text-[#ffcc00] font-bold">impulsa proyectos</span> y aprende en una única plataforma.
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <Link
          to="/nuevo"
          className="bg-[#ff6600] hover:bg-[#ff8800] text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl"
        >
          Forjar pieza
        </Link>
        <a
          href="#galeria"
          className="backdrop-blur-md bg-white/5 border border-white/20 hover:bg-white/10 text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-colors"
        >
          Galería
        </a>
      </div>
    </div>
  </section>
);

    