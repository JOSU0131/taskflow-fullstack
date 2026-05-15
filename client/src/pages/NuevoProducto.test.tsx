// src/pages/NuevoProducto.test.tsx
// Tests de validación del formulario y cambio dinámico de campos por tipo.
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NuevoProducto from './NuevoProducto';

// Evitamos peticiones reales al backend
vi.mock('../api/miniatureService', () => ({
  miniatureService: { create: vi.fn() },
}));

const renderFormulario = () =>
  render(
    <MemoryRouter>
      <NuevoProducto />
    </MemoryRouter>
  );

const clickSubmit = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: /forjar producto/i }));

// ── Validaciones de campos comunes ───────────────────────────────────────────

describe('NuevoProducto — validaciones de campos comunes', () => {
  it('muestra error cuando el título tiene menos de 3 caracteres', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.type(screen.getByPlaceholderText(/Dragón Rojo/i), 'ab');
    await clickSubmit(user);
    expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument();
  });

  it('muestra error cuando el autor está vacío', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.type(screen.getByPlaceholderText(/Dragón Rojo/i), 'Guerrero del Caos');
    // autor queda vacío → siguiente error es el autor
    await clickSubmit(user);
    expect(screen.getByText(/autor es obligatorio/i)).toBeInTheDocument();
  });

  it('muestra error cuando falta la URL de imagen', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.type(screen.getByPlaceholderText(/Dragón Rojo/i), 'Guerrero del Caos');
    await user.type(screen.getByPlaceholderText(/nick de artista/i), 'Artista');
    // imagen vacía → siguiente error
    await clickSubmit(user);
    expect(screen.getByText(/url de imagen es obligatoria/i)).toBeInTheDocument();
  });

  it('muestra error cuando no se elige categoría', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.type(screen.getByPlaceholderText(/Dragón Rojo/i), 'Guerrero del Caos');
    await user.type(screen.getByPlaceholderText(/nick de artista/i), 'Artista');
    await user.type(screen.getByPlaceholderText('https://...'), 'https://img.com/x.jpg');
    // categoría queda en '' → siguiente error
    await clickSubmit(user);
    expect(screen.getByText(/elige una categoría/i)).toBeInTheDocument();
  });
});

// ── Validaciones VENTA ────────────────────────────────────────────────────────

describe('NuevoProducto — validaciones VENTA', () => {
  it('muestra error cuando el precio de VENTA está vacío', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.type(screen.getByPlaceholderText(/Dragón Rojo/i), 'Guerrero del Caos');
    await user.type(screen.getByPlaceholderText(/nick de artista/i), 'Artista');
    await user.type(screen.getByPlaceholderText('https://...'), 'https://img.com/x.jpg');
    await user.selectOptions(screen.getByRole('combobox'), 'Fantasía');
    // precio queda vacío ('' → Number('') = 0, inválido)
    await clickSubmit(user);
    expect(screen.getByText(/precio debe ser mayor/i)).toBeInTheDocument();
  });
});

// ── Cambio dinámico de campos por TIPO ────────────────────────────────────────

describe('NuevoProducto — campos dinámicos por tipo', () => {
  it('por defecto muestra campos VENTA: precio (placeholder 0.00) y stock', () => {
    renderFormulario();
    expect(screen.getByPlaceholderText('0.00')).toBeInTheDocument();
    // El stock inicial es '1'
    expect(screen.getByDisplayValue('1')).toBeInTheDocument();
  });

  it('al cambiar a MECENAZGO aparece el campo meta (placeholder 5000)', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.click(screen.getByRole('button', { name: 'MECENAZGO' }));
    expect(screen.getByPlaceholderText('5000')).toBeInTheDocument();
  });

  it('al cambiar a MECENAZGO desaparecen los campos de VENTA', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.click(screen.getByRole('button', { name: 'MECENAZGO' }));
    expect(screen.queryByPlaceholderText('0.00')).not.toBeInTheDocument();
  });

  it('al cambiar a TUTORIAL aparece el campo duración (placeholder 2 horas)', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.click(screen.getByRole('button', { name: 'TUTORIAL' }));
    expect(screen.getByPlaceholderText('2 horas')).toBeInTheDocument();
  });

  it('al cambiar a TUTORIAL aparece el select de nivel con "Básico" por defecto', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.click(screen.getByRole('button', { name: 'TUTORIAL' }));
    // Hay dos combobox: categoría y nivel. El nivel tiene value inicial "Básico".
    const comboboxes = screen.getAllByRole('combobox');
    const nivelSelect = comboboxes.find(
      (el) => (el as HTMLSelectElement).value === 'Básico'
    );
    expect(nivelSelect).toBeDefined();
  });

  it('el botón del tipo seleccionado tiene clase bg-orange-500', async () => {
    const user = userEvent.setup();
    renderFormulario();
    const botonTutorial = screen.getByRole('button', { name: 'TUTORIAL' });
    await user.click(botonTutorial);
    expect(botonTutorial.className).toContain('bg-orange-500');
  });

  it('el botón VENTA tiene clase bg-orange-500 al inicio (tipo por defecto)', () => {
    renderFormulario();
    expect(screen.getByRole('button', { name: 'VENTA' }).className).toContain('bg-orange-500');
  });
});

// ── Validaciones MECENAZGO ────────────────────────────────────────────────────

describe('NuevoProducto — validaciones MECENAZGO', () => {
  it('muestra error si falta la fecha fin', async () => {
    const user = userEvent.setup();
    renderFormulario();
    await user.click(screen.getByRole('button', { name: 'MECENAZGO' }));
    await user.type(screen.getByPlaceholderText(/Dragón Rojo/i), 'Dragon Ancestral');
    await user.type(screen.getByPlaceholderText(/nick de artista/i), 'ForgeMaster');
    await user.type(screen.getByPlaceholderText('https://...'), 'https://img.com/x.jpg');
    await user.selectOptions(screen.getByRole('combobox'), 'Fantasía');
    await user.type(screen.getByPlaceholderText('5000'), '2000');
    // No rellenamos fecha fin
    await clickSubmit(user);
    expect(screen.getByText(/fecha fin/i)).toBeInTheDocument();
  });
});
