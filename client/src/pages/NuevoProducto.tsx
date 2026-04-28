import { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div>
          <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">
            Nombre de la Miniatura
          </label>
          <input 
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="Ej: Dreadnought de Asalto"
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