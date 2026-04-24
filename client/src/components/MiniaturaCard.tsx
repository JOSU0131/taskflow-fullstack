import type { HammerItem } from '../types/miniatures';
import { calcularProgreso, obtenerEstadoMecenazgo } from '../logic/hammerLogic';

interface Props {
  item: HammerItem;
}

export const MiniaturaCard = ({ item }: Props) => {
  return (
    <div className="relative h-48 w-full overflow-hidden bg-slate-700">
      {/* Imagen con Badge de Tipo */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={item.imagen} 
          alt={item.titulo} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">
            {item.tipo}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <span className="text-xs font-medium text-orange-500/80 uppercase tracking-wider">
          {item.categoria}
        </span>
        <h3 className="text-lg font-bold text-white mt-1 leading-tight h-12 line-clamp-2">
          {item.titulo}
        </h3>
        <p className="text-slate-400 text-sm mt-1">por {item.autor}</p>

        {/* Lógica Condicional según el TIPO */}
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          
          {/* CASO 1: VENTA */}
          {item.tipo === 'VENTA' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Precio</p>
                <p className="text-2xl font-black text-white">{item.precio}€</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{item.stock} disponibles</p>
                <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                  Añadir
                </button>
              </div>
            </div>
          )}

          {/* CASO 2: MECENAZGO */}
          {item.tipo === 'MECENAZGO' && (
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-orange-500">{calcularProgreso(item.recaudado, item.meta)}%</span>
                <span className="text-slate-400">{obtenerEstadoMecenazgo(item.fechaFin)}</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${calcularProgreso(item.recaudado, item.meta)}%` }}
                />
              </div>
              <button className="w-full bg-slate-100 hover:bg-white text-slate-900 py-2 rounded-lg font-bold text-sm transition-colors">
                Apoyar Proyecto
              </button>
            </div>
          )}

          {/* CASO 3: TUTORIAL */}
          {item.tipo === 'TUTORIAL' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold">{item.duracion}</p>
                <p className="text-2xl font-black text-white">{item.precio}€</p>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                Ver Tutorial
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};