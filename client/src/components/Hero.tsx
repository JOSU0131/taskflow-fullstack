// src/components/Hero.tsx
// Sección principal de bienvenida en la home. Más visual que el header
// mínimo anterior. Apoyado en gradientes Tailwind y blur.

import { Link } from 'react-router-dom';

export const Hero = () => (
  <section
    className="relative overflow-hidden w-full min-h-[85vh] flex items-center justify-center"
    style={{ 
      backgroundImage: "url('/hero-highlands.jpg')", 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }}
  >

    {/* 2. Velo de oscuridad para legibilidad */}
    <div className="absolute inset-0 bg-black/40" />

    {/* 3. Contenido centrado y más grande */}
    <div className="relative z-10 p-6 md:p-20 max-w-5xl text-center">
      <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4 uppercase italic"
          style={{
            color: '#ffcc00', 
            textShadow: '4px 4px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 10px 20px rgba(0,0,0,0.8)',
            lineHeight: '0.85'
          }}>
        Hammerflow <br/> Forge
      </h1>

      <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mt-6">
        Compra, financia y <span className="text-[#ffcc00]">aprende</span> el arte de las miniaturas.
      </h2>
      
      {/* 4. Botones centrados */}
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        <Link
          to="/nuevo"
          className="bg-[#ff6600] hover:bg-[#ff8800] text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl shadow-black"
        >
          Forjar nueva pieza
        </Link>
        <a
          href="#galeria"
          className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-sm font-bold text-sm uppercase tracking-[0.2em] transition-colors"
        >
          Ver galería
        </a>
      </div>
    </div>
  </section>
);

    