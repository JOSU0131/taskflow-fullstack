// src/components/MiniaturaCard.tsx
// Tarjeta de producto. Renderizado condicional según el TIPO (unión
// discriminada). Toda la card es un <Link> al detalle.

import { Link } from 'react-router-dom';
import type { HammerItem } from '../types/miniatures';
import { calcularProgreso, obtenerEstadoMecenazgo } from '../logic/hammerLogic';
import { FavoritoButton } from './FavoritoButton';

interface Props {
  item: HammerItem;
}

// Color del badge superior según el tipo. Pequeño detalle visual que
// hace mucho por la lectura rápida.
const colorBadge: Record<HammerItem['tipo'], string> = {
  VENTA: 'bg-orange-500/90 text-white',
  MECENAZGO: 'bg-purple-500/90 text-white',
  TUTORIAL: 'bg-blue-500/90 text-white',
};

export const MiniaturaCard = ({ item }: Props) => {
  return (
    <Link
      to={`/producto/${item.id}`}
      className="group relative flex flex-col bg-slate-900 rounded-xl overflow-hidden
        border border-slate-800 hover:border-orange-500/50
        transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10"
    >
      {/* Imagen con overlay y badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        <img
          src={item.imagen}
          alt={item.titulo}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradiente para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        {/* Badge tipo */}
        <div className={`absolute top-3 left-3 backdrop-blur-md px-2.5 py-1 rounded-md ${colorBadge[item.tipo]}`}>
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
        <span className="text-xs font-medium text-orange-500/80 uppercase tracking-wider">
          {item.categoria}
        </span>
        <h3 className="text-lg font-bold text-white mt-1 leading-tight h-12 line-clamp-2">
          {item.titulo}
        </h3>
        <p className="text-slate-400 text-sm mt-1">por {item.autor}</p>

        {/* Lógica condicional según el TIPO */}
        <div className="mt-auto pt-4 border-t border-slate-700/50">

          {item.tipo === 'VENTA' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Precio</p>
                <p className="text-2xl font-black text-white">{item.precio.toLocaleString('es-ES')}€</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{item.stock} disponibles</p>
                <span className="inline-block mt-2 bg-orange-500 group-hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                  Ver detalle
                </span>
              </div>
            </div>
          )}

          {item.tipo === 'MECENAZGO' && (
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-orange-500">{calcularProgreso(item.recaudado, item.meta)}%</span>
                <span className="text-slate-400">{obtenerEstadoMecenazgo(item.fechaFin)}</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${calcularProgreso(item.recaudado, item.meta)}%` }}
                />
              </div>
              <span className="block w-full text-center bg-slate-100 group-hover:bg-white text-slate-900 py-2 rounded-lg font-bold text-sm transition-colors">
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
              <span className="inline-block bg-blue-500 group-hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                Ver tutorial
              </span>
            </div>
          )}

        </div>
      </div>
    </Link>
  );
};
