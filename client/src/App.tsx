import { MiniaturaCard } from './components/MiniaturaCard';
import { PRODUCTOS_MOCK } from './data/mockData';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Encabezado del Marketplace */}
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-white italic">
          HAMMER<span className="text-orange-500">FLOW</span> FORGE
        </h1>
        <p className="text-slate-400 mt-2 font-medium">
          El mercado definitivo para artistas de miniaturas y wargames.
        </p>
      </header>

      {/* Grid de Productos */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTOS_MOCK.map((item) => (
            <MiniaturaCard key={item.id} item={item} />
          ))}
        </div>
      </main>

      {/* Footer simple */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} HammerFlow Forge - Panel de Control de Artista
      </footer>
    </div>
  );
}

export default App;