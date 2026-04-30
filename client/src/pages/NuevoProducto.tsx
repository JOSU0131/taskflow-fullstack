import { miniatureService } from '../api/miniatureService';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Categoria } from '../types/miniatures';

export default function NuevoProducto() {
  //    Estados para cada campo
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState<Categoria | ''>('');
  const [descripcion, setDescripcion] = useState('');

// NUEVOS ESTADOS para manejo de errores y confirmación de envío (PASO 10)
  const [error, setError] = useState(''); 
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Limpiamos estados de intentos previos
    setError('');
    setEnviado(false);

    // 2. Validación básica (Paso 10/11)
    if (nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (Number(precio) <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }

    try {
      // 3. CAPA DE RED: Enviamos al backend y esperamos (Paso 12)
      await miniatureService.createMiniature({
        nombre,
        precio: Number(precio),
        categoria: categoria as any, // 'any' temporal para evitar conflictos de tipos
        descripcion
      });

      // 4. ÉXITO: Si el servidor responde 201
      setEnviado(true);
      
      // Limpiamos los campos para una nueva entrada
      setNombre('');
      setPrecio('');
      setCategoria('');
      setDescripcion('');

    } catch (err) {
      // 5. GESTIÓN DE ERROR DE RED
      setError('Hubo un problema con la forja (Error de conexión con el servidor).');
      console.error("Error al crear:", err);
    }
  };


  return (
    <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Registrar <span className="text-orange-500">Nueva Pieza</span>
        </h2>
        <Link to="/" className="text-slate-500 hover:text-orange-500 text-sm font-bold transition-colors">
          ← Volver a la Galería
        </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {/* NOMBRE */}
            <div>
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Nombre de la Unidad</label>
            <input 
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-orange-500 outline-none transition-all"
                placeholder="Ej: Dragón Rojo Cromático"
            />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PRECIO */}
                <div>
                <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Precio (€)</label>
                <input 
                    type="number"
                    required
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-orange-500 outline-none transition-all"
                    placeholder="0.00"
                />
                </div>

                {/* CATEGORÍA */}
                <div>
                    <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Categoría</label>
                    <select 
                    required
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as Categoria)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-orange-500 outline-none transition-all appearance-none"
                    >
                    <option value="">Seleccionar...</option>
                    <option value="Fantasía">Fantasía</option>
                    <option value="Bustos">Bustos</option>
                    <option value="Monstruos">Monstruos</option>
                    <option value="Tutorial Pintado">Tutorial</option>
                    </select>
                </div>
            </div>

            {/* DESCRIPCIÓN */}
            <div>
            <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Descripción / Lore</label>
            <textarea 
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:border-orange-500 outline-none transition-all h-32 resize-none"
                placeholder="Describe los detalles de la pintura o la historia de la miniatura..."
            />
            </div>
    
            {/* MENSAJE DE ERROR */}  
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm font-bold animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* MENSAJE DE ÉXITO */}
            {enviado && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg text-sm font-bold">
                ✅ ¡Unidad forjada y añadida al inventario!
              </div>
            )}



            <button 
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-lg uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20"
            >
            Forjar Producto
            </button>

        </form>
    </div>
  );
}