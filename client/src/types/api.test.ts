// src/types/api.test.ts
import { describe, it, expect } from 'vitest';
import { ApiError } from './api';

describe('ApiError', () => {
  it('extiende Error nativo', () => {
    const err = new ApiError(404, 'No encontrado');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(ApiError);
  });

  it('tiene name "ApiError"', () => {
    expect(new ApiError(500, 'fallo').name).toBe('ApiError');
  });

  it('guarda el status HTTP correctamente', () => {
    expect(new ApiError(400, 'mal').status).toBe(400);
    expect(new ApiError(404, 'no').status).toBe(404);
    expect(new ApiError(500, 'server').status).toBe(500);
  });

  it('guarda el mensaje en .message', () => {
    const err = new ApiError(422, 'Datos inválidos');
    expect(err.message).toBe('Datos inválidos');
  });

  it('body es null por defecto', () => {
    expect(new ApiError(400, 'error').body).toBeNull();
  });

  it('guarda el body si se proporciona', () => {
    const body = { message: 'El título es obligatorio' };
    const err = new ApiError(400, 'Error', body);
    expect(err.body).toEqual(body);
    expect(err.body?.message).toBe('El título es obligatorio');
  });

  it('puede usarse en un bloque catch como instanceof Error', () => {
    const lanzar = () => { throw new ApiError(403, 'Prohibido'); };
    let capturado: unknown = null;
    try { lanzar(); } catch (e) { capturado = e; }
    expect(capturado).toBeInstanceOf(Error);
    expect(capturado).toBeInstanceOf(ApiError);
    expect((capturado as ApiError).status).toBe(403);
  });
});
