import type { HammerItem } from '../types/miniatures';
import { MiniaturaCard } from './MiniaturaCard';

interface GridProps {
  items: HammerItem[];
}

export const GridProductos = ({ items }: GridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <MiniaturaCard key={item.id} item={item} />
      ))}
    </div>
  );
};