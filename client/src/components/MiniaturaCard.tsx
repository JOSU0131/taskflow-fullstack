// src/components/MiniaturaCard.tsx
// Tarjeta de producto. Renderizado condicional según el TIPO (unión
// discriminada). Toda la card es un <Link> al detalle.

// src/components/MiniaturaCard.tsx
import { Link } from 'react-router-dom';
import type { HammerItem } from '../types/miniatures';
import { calcularProgreso, obtenerEstadoMecenazgo } from '../logic/hammerLogic';
import { FavoritoButton } from './FavoritoButton';

interface Props {
  item: HammerItem;
}

// Colores de los badges superiores ajustados para ser más vibrantes sobre fondo negro
const colorBadge: Record<HammerItem['tipo'], string> = {
  VENTA: 'bg-[#ff6600] text-white',
  MECENAZGO: 'bg-purple-600 text-white',
  TUTORIAL: 'bg-orange-700 text-white',
};

export const MiniaturaCard = ({ item }: Props) => {
  return (
    <Link
      to={`/producto/${item.id}`}
      className="group relative flex flex-col bg-[#0a0a0a] rounded-xl overflow-hidden
        border border-white/5 hover:border-[#ff6600]/50
        transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ff6600]/10"
    >
      {/* Imagen con overlay y badges - Fondo negro puro */}
      <div className="relative h-48 w-full overflow-hidden bg-black">
        <img
          src={item.imagen}
          alt={item.titulo}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradiente oscuro para que el texto resalte */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Badge tipo */}
        <div className={`absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-sm ${colorBadge[item.tipo]}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {item.tipo}
          </span>
        </div>

        {/* Botón favorito */}
        <div className="absolute top-3 right-3">
          <FavoritoButton id={item.id} size={18} />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-5">
        <span className="text-xs font-medium text-[#ff6600]/90 uppercase tracking-wider">
          {item.categoria}
        </span>
        <h3 className="text-lg font-bold text-white mt-1 leading-tight h-12 line-clamp-2 font-serif italic">
          {item.titulo}
        </h3>
        <p className="text-slate-500 text-sm mt-1 font-medium">por {item.autor}</p>

        {/* Lógica condicional - Separador sutil */}
        <div className="mt-auto pt-4 border-t border-white/10">

          {item.tipo === 'VENTA' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Precio</p>
                <p className="text-2xl font-black text-white">{item.precio.toLocaleString('es-ES')}€</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-2">{item.stock} disponibles</p>
                <span className="inline-block bg-[#ff6600] group-hover:bg-[#ff8800] text-white px-4 py-2 rounded-sm font-bold text-sm transition-colors uppercase tracking-tight">
                  Ver detalle
                </span>
              </div>
            </div>
          )}

          {item.tipo === 'MECENAZGO' && (
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#ff6600]">{calcularProgreso(item.recaudado, item.meta)}%</span>
                <span className="text-slate-500 uppercase">{obtenerEstadoMecenazgo(item.fechaFin)}</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#ff6600] to-[#ffcc00] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${calcularProgreso(item.recaudado, item.meta)}%` }}
                />
              </div>
              <span className="block w-full text-center bg-white group-hover:bg-[#ffcc00] text-black py-2 rounded-sm font-bold text-sm transition-colors uppercase italic">
                Apoyar Proyecto
              </span>
            </div>
          )}

          {item.tipo === 'TUTORIAL' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">{item.duracion} · {item.nivel}</p>
                <p className="text-2xl font-black text-white">{item.precio.toLocaleString('es-ES')}€</p>
              </div>
              <span className="inline-block bg-[#ff6600] group-hover:bg-[#ff8800] text-white px-4 py-2 rounded-sm font-bold text-sm transition-colors uppercase">
                Ver tutorial
              </span>
            </div>
          )}

        </div>
      </div>
    </Link>
  );
};