// src/components/MiniaturaCard.test.tsx
// Test de integración ligera: renderiza la card + el contexto de favoritos
// + el router (porque la card es un Link).

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { MiniaturaCard } from './MiniaturaCard';
import { FavoritosProvider } from '../context/FavoritosProvider';
import type { ItemVenta } from '../types/miniatures';

const mockVenta: ItemVenta = {
  id: '1',
  tipo: 'VENTA',
  titulo: 'Guerrero del Caos',
  autor: 'Archaon_Paints',
  imagen: 'https://example.com/x.jpg',
  categoria: 'Fantasía',
  precio: 50,
  stock: 1,
};

const renderConProviders = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <FavoritosProvider>{ui}</FavoritosProvider>
    </MemoryRouter>
  );

describe('MiniaturaCard', () => {
  it('muestra el título, autor, categoría y precio para VENTA', () => {
    renderConProviders(<MiniaturaCard item={mockVenta} />);

    expect(screen.getByText('Guerrero del Caos')).toBeInTheDocument();
    expect(screen.getByText(/Archaon_Paints/)).toBeInTheDocument();
    expect(screen.getByText('Fantasía')).toBeInTheDocument();
    expect(screen.getByText('50€')).toBeInTheDocument();
    expect(screen.getByText('1 disponibles')).toBeInTheDocument();
  });

  it('enlaza a /producto/:id', () => {
    renderConProviders(<MiniaturaCard item={mockVenta} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/producto/1');
  });

  it('togglea favorito al pulsar el corazón sin navegar', async () => {
    const user = userEvent.setup();
    renderConProviders(<MiniaturaCard item={mockVenta} />);

    const fav = screen.getByRole('button', { name: /añadir a favoritos/i });
    expect(fav).toHaveAttribute('aria-pressed', 'false');

    await user.click(fav);

    // Re-buscamos el botón porque el aria-label habrá cambiado
    const favActivo = screen.getByRole('button', { name: /quitar de favoritos/i });
    expect(favActivo).toHaveAttribute('aria-pressed', 'true');
  });
});
