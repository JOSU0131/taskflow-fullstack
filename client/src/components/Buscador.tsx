// src/components/Buscador.tsx
// Input de búsqueda controlado. La lógica de debounce vive en useProductos.

interface Props {
  valor: string;
  onCambio: (nuevo: string) => void;
  placeholder?: string;
}

export const Buscador = ({ valor, onCambio, placeholder = 'Buscar por título o autor...' }: Props) => (
  <div className="relative w-full md:max-w-md">
    <input
      type="search"
      value={valor}
      onChange={(e) => onCambio(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 
      px-4 py-3 rounded-sm focus:outline-none focus:border-[#ff6600]/50 focus:ring-1
       focus:ring-[#ff6600]/50 transition-all"
      aria-label="Buscador de miniaturas"
    />
  </div>
);
