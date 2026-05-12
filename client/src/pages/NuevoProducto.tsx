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
  'Tutorial Pintado',
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
      // Vamos directos a la pieza creada (mejor UX que un mensaje y limpiar)
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

  // Estilos compartidos
  const inputClass =
    'w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white ' +
    'focus:border-orange-500 outline-none transition-all';
  const labelClass =
    'block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest';

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Registrar <span className="text-orange-500">Nueva Pieza</span>
        </h2>
        <Link to="/" className="text-slate-500 hover:text-orange-500 text-sm font-bold transition-colors">
          ← Volver
        </Link>
      </div>

      {/* Selector de TIPO (3 botones grandes) */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        {(['VENTA', 'MECENAZGO', 'TUTORIAL'] as TipoForm[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipo(t)}
            className={`py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all
              ${tipo === t
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Campos comunes */}
        <div>
          <label className={labelClass}>Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className={inputClass}
            placeholder="Ej: Dragón Rojo Cromático"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Autor</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className={inputClass}
              placeholder="Tu nick de artista"
            />
          </div>
          <div>
            <label className={labelClass}>Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className={`${inputClass} appearance-none`}
            >
              <option value="">Seleccionar...</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>URL de imagen</label>
          <input
            type="url"
            value={imagen}
            onChange={(e) => setImagen(e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        {/* Campos específicos por tipo */}
        {tipo === 'VENTA' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Precio (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className={inputClass}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input
                type="number"
                min="0"
                step="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {tipo === 'MECENAZGO' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Meta (€)</label>
              <input
                type="number"
                min="0"
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
                min="0"
                value={recaudado}
                onChange={(e) => setRecaudado(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Fecha fin</label>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Precio (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className={inputClass}
                placeholder="20"
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
              <label className={labelClass}>Nivel</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value as Nivel)}
                className={`${inputClass} appearance-none`}
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm font-bold">
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
            text-white font-black py-4 rounded-lg uppercase tracking-widest transition-all
            transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20"
        >
          {enviando ? 'Forjando...' : 'Forjar Producto'}
        </button>
      </form>
    </div>
  );
}
