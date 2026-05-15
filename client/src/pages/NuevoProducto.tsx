// src/pages/NuevoProducto.tsx
// Formulario para registrar una nueva pieza. Adaptado a los 3 tipos.
//
// Patrón: el usuario primero elige TIPO, y los campos cambian según
// la elección. Toda la información se ensambla al final en un objeto
// que cumple HammerItem (sin id, que lo pone el backend).

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { miniatureService } from '../api/miniatureService';
import { ApiError } from '../types/api';
import type { Categoria, HammerItemSinId } from '../types/miniatures';

type TipoForm = 'VENTA' | 'MECENAZGO' | 'TUTORIAL';
type Nivel = 'Básico' | 'Intermedio' | 'Avanzado';

const CATEGORIAS: Categoria[] = [
  'Fantasía',
  'Bustos',
  'WIPS',
  'Monstruos',
  'Tutorial',
  'Tutorial Esculpido',
  'Otros',
];

export default function NuevoProducto() {
  const navigate = useNavigate();

  // Campos comunes
  const [tipo, setTipo] = useState<TipoForm>('VENTA');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [imagen, setImagen] = useState('');
  const [categoria, setCategoria] = useState<Categoria | ''>('');

  // Campos específicos
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('1');
  const [meta, setMeta] = useState('');
  const [recaudado, setRecaudado] = useState('0');
  const [fechaFin, setFechaFin] = useState('');
  const [duracion, setDuracion] = useState('');
  const [nivel, setNivel] = useState<Nivel>('Básico');

  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  /**
   * Construye el objeto a enviar al backend según el tipo seleccionado.
   * Devuelve null si la validación cliente falla, y guarda el motivo en error.
   */
  const construirItem = (): HammerItemSinId | null => {
    if (titulo.trim().length < 3) {
      setError('El título debe tener al menos 3 caracteres.');
      return null;
    }
    if (!autor.trim()) {
      setError('El autor es obligatorio.');
      return null;
    }
    if (!imagen.trim()) {
      setError('La URL de imagen es obligatoria.');
      return null;
    }
    if (!categoria) {
      setError('Debes elegir una categoría.');
      return null;
    }

    const base = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      imagen: imagen.trim(),
      categoria: categoria,
    };

    if (tipo === 'VENTA') {
      const p = Number(precio);
      const s = Number(stock);
      if (!Number.isFinite(p) || p <= 0) {
        setError('El precio debe ser mayor que 0.');
        return null;
      }
      if (!Number.isFinite(s) || s < 0) {
        setError('El stock debe ser 0 o mayor.');
        return null;
      }
      return { ...base, tipo: 'VENTA', precio: p, stock: s };
    }

    if (tipo === 'MECENAZGO') {
      const m = Number(meta);
      const r = Number(recaudado);
      if (!Number.isFinite(m) || m <= 0) {
        setError('La meta debe ser mayor que 0.');
        return null;
      }
      if (!Number.isFinite(r) || r < 0) {
        setError('Lo recaudado debe ser 0 o mayor.');
        return null;
      }
      if (!fechaFin) {
        setError('Indica una fecha fin para el mecenazgo.');
        return null;
      }
      return { ...base, tipo: 'MECENAZGO', meta: m, recaudado: r, fechaFin };
    }

    // TUTORIAL
    const p = Number(precio);
    if (!Number.isFinite(p) || p <= 0) {
      setError('El precio debe ser mayor que 0.');
      return null;
    }
    if (!duracion.trim()) {
      setError('Indica la duración del tutorial (ej: "2 horas").');
      return null;
    }
    return { ...base, tipo: 'TUTORIAL', precio: p, duracion: duracion.trim(), nivel };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const item = construirItem();
    if (!item) return;

    try {
      setEnviando(true);
      const creada = await miniatureService.create(item);
      navigate(`/producto/${creada.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Hubo un problema con la forja (Error de conexión con el servidor).');
      }
    } finally {
      setEnviando(false);
    }
  };

  // ESTILOS ESTÉTICOS (Bordes más grandes y estética oscura de la forja)
  const inputClass =
    'w-full bg-black border-2 border-white/10 rounded-sm py-3 px-4 text-white ' +
    'focus:border-[#ff6600] outline-none transition-all font-serif italic';
  
  const labelClass =
    'block text-xs font-black text-[#ff6600] mb-2 uppercase tracking-[0.2em]';

  return (
    <div className="max-w-2xl mx-auto bg-[#0a0a0a] p-6 md:p-10 rounded-sm border-2 border-white/5 shadow-2xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
            Registrar <span className="text-[#ff6600]">Nueva Pieza</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1 font-serif italic">Añade tu obra al catálogo de la forja</p>
        </div>
        <Link to="/" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest border-b border-white/10 transition-colors">
          ← Volver
        </Link>
      </div>

      {/* Selector de TIPO (3 botones con estética metálica) */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {(['VENTA', 'MECENAZGO', 'TUTORIAL'] as TipoForm[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipo(t)}
            className={`py-3 rounded-sm font-black text-[10px] uppercase tracking-tighter transition-all border-2
              ${tipo === t
                ? 'bg-[#ff6600] border-[#ff6600] text-white shadow-lg shadow-[#ff6600]/20'
                : 'bg-black border-white/10 text-slate-500 hover:border-white/20'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Campos comunes */}
        <div>
          <label className={labelClass}>Título de la obra</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={inputClass}
            placeholder="Ej: Dragón Rojo Cromático"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Autor / Maestro</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className={inputClass}
              placeholder="Tu firma"
            />
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="">Seleccionar...</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>URL de imagen (El pergamino visual)</label>
          <input
            type="url"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        {/* Campos específicos por tipo con divisor sutil */}
        <div className="pt-6 border-t-2 border-white/5">
          {tipo === 'VENTA' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Precio de Venta (€)</label>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className={labelClass}>Unidades en Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {tipo === 'MECENAZGO' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Meta (€)</label>
                <input
                  type="number"
                  value={meta}
                  onChange={(e) => setMeta(e.target.value)}
                  className={inputClass}
                  placeholder="5000"
                />
              </div>
              <div>
                <label className={labelClass}>Recaudado (€)</label>
                <input
                  type="number"
                  value={recaudado}
                  onChange={(e) => setRecaudado(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Fecha Cierre</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {tipo === 'TUTORIAL' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Precio (€)</label>
                <input
                  type="number"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Duración</label>
                <input
                  type="text"
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className={inputClass}
                  placeholder="2 horas"
                />
              </div>
              <div>
                <label className={labelClass}>Nivel de Maestría</label>
                <select
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value as Nivel)}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="Básico">Básico</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-900/10 border-2 border-red-900/50 text-red-500 p-4 rounded-sm text-xs font-black uppercase tracking-widest text-center">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-[#ff6600] hover:bg-[#ff8800] disabled:opacity-50
            text-white font-black py-5 rounded-sm uppercase tracking-[0.3em] transition-all
            shadow-xl shadow-[#ff6600]/10 active:scale-[0.98]"
        >
          {enviando ? 'Iniciando Forja...' : 'Consagrar en la Forja'}
        </button>
      </form>
    </div>
  );
}