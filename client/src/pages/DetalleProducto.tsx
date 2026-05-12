// src/pages/DetalleProducto.tsx
// Vista de detalle de una miniatura. Carga los datos por id desde la API.
// Renderizado condicional según el tipo (VENTA / MECENAZGO / TUTORIAL).

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { miniatureService } from '../api/miniatureService';
import type { HammerItem } from '../types/miniatures';
import { ApiError } from '../types/api';
import { calcularProgreso, obtenerEstadoMecenazgo } from '../logic/hammerLogic';
import { FavoritoButton } from '../components/FavoritoButton';

export default function DetalleProducto() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<HammerItem | null>(null);
  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtener = async () => {
      if (!id) {
        setError('No se ha indicado el id de la pieza');
        setEstaCargando(false);
        return;
      }

      try {
        setEstaCargando(true);
        setError(null);
        const data = await miniatureService.getById(id);
        setItem(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('Esta pieza no existe o ha sido retirada de la galería.');
        } else {
          setError('No se pudo conectar con la forja.');
        }
      } finally {
        setEstaCargando(false);
      }
    };
    obtener();
  }, [id]);

  if (estaCargando) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-20">
        <p className="text-6xl mb-4">⚒️</p>
        <h2 className="text-2xl font-bold text-white mb-2">{error ?? 'Pieza no encontrada'}</h2>
        <Link
          to="/"
          className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3
            rounded-lg font-bold text-sm uppercase tracking-widest transition-colors"
        >
          ← Volver a la galería
        </Link>
      </div>
    );
  }

  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
      {/* Imagen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <img src={item.imagen} alt={item.titulo} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4">
          <FavoritoButton id={item.id} size={22} />
        </div>
      </div>

      {/* Datos */}
      <div className="flex flex-col">
        <Link to="/" className="text-slate-500 hover:text-orange-500 text-sm font-bold transition-colors mb-4">
          ← Volver a la galería
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500">
            {item.categoria}
          </span>
          <span className="text-slate-700">·</span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {item.tipo}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
          {item.titulo}
        </h1>
        <p className="text-slate-400 mt-3 font-medium">por {item.autor}</p>

        <div className="my-8 h-px bg-slate-800" />

        {/* Bloque específico según tipo */}
        {item.tipo === 'VENTA' && (
          <div className="space-y-6">
            <div className="flex items-end gap-4">
              <p className="text-5xl font-black text-white">{item.precio.toLocaleString('es-ES')}€</p>
              <p className="text-sm text-slate-400 mb-2">{item.stock} disponibles</p>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Pieza única lista para tu colección. Pintada y barnizada por su autor.
              Una vez vendida, no se reedita.
            </p>
            <button
              type="button"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg
                font-black uppercase tracking-widest transition-all
                hover:scale-[1.01] active:scale-95 shadow-lg shadow-orange-500/30"
            >
              Añadir al inventario
            </button>
          </div>
        )}

        {item.tipo === 'MECENAZGO' && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-orange-500">
                  {calcularProgreso(item.recaudado, item.meta)}% financiado
                </span>
                <span className="text-slate-400">{obtenerEstadoMecenazgo(item.fechaFin)}</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${calcularProgreso(item.recaudado, item.meta)}%` }}
                />
              </div>
              <p className="text-slate-400 text-sm mt-3">
                <span className="text-white font-bold">{item.recaudado.toLocaleString()}€</span>{' '}
                recaudados de <span className="text-white font-bold">{item.meta.toLocaleString()}€</span>
              </p>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Apoya a este artista para que pueda finalizar su proyecto. Las recompensas
              llegarán cuando se cierre la campaña.
            </p>
            <button
              type="button"
              className="w-full bg-white hover:bg-slate-100 text-slate-900 py-4 rounded-lg
                font-black uppercase tracking-widest transition-all
                hover:scale-[1.01] active:scale-95 shadow-lg"
            >
              Apoyar este proyecto
            </button>
          </div>
        )}

        {item.tipo === 'TUTORIAL' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-blue-500/15 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest">
                {item.duracion}
              </span>
              <span className="px-3 py-1.5 bg-blue-500/15 text-blue-300 rounded-full text-xs font-bold uppercase tracking-widest">
                Nivel {item.nivel}
              </span>
              <span className="px-3 py-1.5 bg-orange-500/15 text-orange-300 rounded-full text-xs font-bold uppercase tracking-widest">
                {item.precio.toLocaleString('es-ES')}€
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Videocurso paso a paso con material descargable. Acceso ilimitado tras la compra.
            </p>
            <button
              type="button"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg
                font-black uppercase tracking-widest transition-all
                hover:scale-[1.01] active:scale-95 shadow-lg shadow-blue-500/30"
            >
              Acceder al tutorial
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
