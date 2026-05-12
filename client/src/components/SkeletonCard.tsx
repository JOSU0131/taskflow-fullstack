// src/components/SkeletonCard.tsx
// Placeholder animado que reemplaza al spinner durante la carga.
// Da sensación de "estructura" inminente (mejor UX).

export const SkeletonCard = () => (
  <div className="flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 animate-pulse">
    <div className="h-48 w-full bg-slate-800" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-20 bg-slate-800 rounded" />
      <div className="h-5 w-4/5 bg-slate-800 rounded" />
      <div className="h-3 w-1/3 bg-slate-800 rounded" />
      <div className="pt-4 mt-4 border-t border-slate-700/50 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-2 w-12 bg-slate-800 rounded" />
          <div className="h-7 w-16 bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-24 bg-slate-800 rounded-lg" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
