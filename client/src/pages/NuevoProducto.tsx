import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Categoria } from '../types/miniatures';

export default function NuevoProducto() {
  //    Estados para cada campo
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState<Categoria | ''>('');
  const [descripcion, setDescripcion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí es donde validamos los datos antes de enviarlos
    console.log({ nombre, precio, categoria, descripcion });
    alert(`¡El ${nombre} ha sido catalogado por ${precio} piezas de oro!`);
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