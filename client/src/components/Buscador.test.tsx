// src/components/Buscador.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Buscador } from './Buscador';

describe('Buscador', () => {
  it('muestra el placeholder por defecto', () => {
    render(<Buscador valor="" onCambio={() => {}} />);
    expect(
      screen.getByPlaceholderText('Buscar por título o autor...')
    ).toBeInTheDocument();
  });

  it('acepta un placeholder personalizado', () => {
    render(<Buscador valor="" onCambio={() => {}} placeholder="Buscar artista..." />);
    expect(screen.getByPlaceholderText('Buscar artista...')).toBeInTheDocument();
  });

  it('muestra el valor controlado pasado por prop', () => {
    render(<Buscador valor="guerrero" onCambio={() => {}} />);
    expect(screen.getByRole('searchbox')).toHaveValue('guerrero');
  });

  it('llama a onCambio cuando el usuario escribe', async () => {
    const onCambio = vi.fn();
    const user = userEvent.setup();
    render(<Buscador valor="" onCambio={onCambio} />);
    await user.type(screen.getByRole('searchbox'), 'a');
    expect(onCambio).toHaveBeenCalledWith('a');
  });

  it('llama a onCambio tantas veces como letras se teclean', async () => {
    const onCambio = vi.fn();
    const user = userEvent.setup();
    render(<Buscador valor="" onCambio={onCambio} />);
    await user.type(screen.getByRole('searchbox'), 'abc');
    expect(onCambio).toHaveBeenCalledTimes(3);
  });

  it('tiene aria-label accesible', () => {
    render(<Buscador valor="" onCambio={() => {}} />);
    expect(
      screen.getByLabelText('Buscador de miniaturas')
    ).toBeInTheDocument();
  });

  it('el input es de tipo search', () => {
    render(<Buscador valor="" onCambio={() => {}} />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
  });
});
