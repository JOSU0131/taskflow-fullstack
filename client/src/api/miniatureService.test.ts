// src/api/miniatureService.test.ts
// Prueba el cliente HTTP usando un mock de fetch global.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { miniatureService } from './miniatureService';
import { ApiError } from '../types/api';
import type { HammerItem, ItemVenta } from '../types/miniatures';

// --- helpers ---

const mockFetch = vi.fn();

const makeOkResponse = (body: unknown, status = 200) => ({
  ok: true,
  status,
  statusText: 'OK',
  json: async () => body,
});

const makeErrorResponse = (body: unknown, status: number) => ({
  ok: false,
  status,
  statusText: 'Error',
  json: async () => body,
});

const sampleVenta: ItemVenta = {
  id: '1',
  tipo: 'VENTA',
  titulo: 'Guerrero del Caos',
  autor: 'Archaon_Paints',
  imagen: 'https://example.com/img.jpg',
  categoria: 'Fantasía',
  precio: 50,
  stock: 1,
};

// --- setup ---

beforeEach(() => {
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// --- tests ---

describe('miniatureService.getAllMiniatures', () => {
  it('devuelve el array de la respuesta', async () => {
    const lista: HammerItem[] = [sampleVenta];
    mockFetch.mockResolvedValue(makeOkResponse(lista));
    const result = await miniatureService.getAllMiniatures();
    expect(result).toEqual(lista);
  });

  it('hace GET a /api/miniatures', async () => {
    mockFetch.mockResolvedValue(makeOkResponse([]));
    await miniatureService.getAllMiniatures();
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/miniatures'));
  });

  it('lanza ApiError si el servidor responde con error', async () => {
    mockFetch.mockResolvedValue(makeErrorResponse({ message: 'Server error' }, 500));
    await expect(miniatureService.getAllMiniatures()).rejects.toBeInstanceOf(ApiError);
  });
});

describe('miniatureService.getById', () => {
  it('devuelve el item correcto', async () => {
    mockFetch.mockResolvedValue(makeOkResponse(sampleVenta));
    const result = await miniatureService.getById('1');
    expect(result).toEqual(sampleVenta);
  });

  it('incluye el id en la URL', async () => {
    mockFetch.mockResolvedValue(makeOkResponse(sampleVenta));
    await miniatureService.getById('42');
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/42'));
  });

  it('lanza ApiError con status 404 si no existe', async () => {
    mockFetch.mockResolvedValue(
      makeErrorResponse({ message: 'No existe ninguna pieza con id 999' }, 404)
    );
    const err = await miniatureService.getById('999').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(404);
    expect(err.message).toBe('No existe ninguna pieza con id 999');
  });
});

describe('miniatureService.create', () => {
  const nuevaMini = {
    tipo: 'VENTA' as const,
    titulo: 'Nueva pieza',
    autor: 'Artista',
    imagen: 'https://example.com/x.jpg',
    categoria: 'Fantasía' as const,
    precio: 30,
    stock: 2,
  };

  it('hace POST y devuelve el item creado', async () => {
    const creado = { id: '99', ...nuevaMini };
    mockFetch.mockResolvedValue(makeOkResponse(creado, 201));
    const result = await miniatureService.create(nuevaMini);
    expect(result).toEqual(creado);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('envía el body como JSON con Content-Type correcto', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ id: '1', ...nuevaMini }, 201));
    await miniatureService.create(nuevaMini);
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(options.body)).toMatchObject(nuevaMini);
  });

  it('lanza ApiError con status 400 si los datos son inválidos', async () => {
    mockFetch.mockResolvedValue(
      makeErrorResponse({ message: 'El título es obligatorio' }, 400)
    );
    const err = await miniatureService.create(nuevaMini).catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(400);
  });
});

describe('miniatureService.delete', () => {
  it('hace DELETE y devuelve message + id', async () => {
    mockFetch.mockResolvedValue(makeOkResponse({ message: 'Pieza eliminada', id: '1' }));
    const result = await miniatureService.delete('1');
    expect(result).toEqual({ message: 'Pieza eliminada', id: '1' });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      { method: 'DELETE' }
    );
  });

  it('lanza ApiError 404 al borrar un id inexistente', async () => {
    mockFetch.mockResolvedValue(
      makeErrorResponse({ message: 'No se puede borrar lo que no existe' }, 404)
    );
    const err = await miniatureService.delete('999').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(404);
  });
});

describe('miniatureService.update', () => {
  it('hace PUT con el id en la URL y devuelve el item actualizado', async () => {
    const actualizado = { ...sampleVenta, precio: 75 };
    mockFetch.mockResolvedValue(makeOkResponse(actualizado));
    const result = await miniatureService.update('1', { precio: 75 });
    expect(result).toEqual(actualizado);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      expect.objectContaining({ method: 'PUT' })
    );
  });
});
