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
      className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 focus:border-orange-500
        rounded-lg py-3 pl-11 pr-4 text-white placeholder:text-slate-500
        outline-none transition-all"
      aria-label="Buscador de miniaturas"
    />
    <svg
      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  </div>
);
