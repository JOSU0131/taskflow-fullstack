// src/logic/hammerLogic.test.ts
import { describe, it, expect } from 'vitest';
import { calcularProgreso, obtenerEstadoMecenazgo } from './hammerLogic';

describe('calcularProgreso', () => {
  it('devuelve un porcentaje entero entre 0 y 100', () => {
    expect(calcularProgreso(0, 1000)).toBe(0);
    expect(calcularProgreso(500, 1000)).toBe(50);
    expect(calcularProgreso(1000, 1000)).toBe(100);
  });

  it('limita el progreso a 100 incluso si se supera la meta', () => {
    expect(calcularProgreso(2000, 1000)).toBe(100);
  });

  it('redondea correctamente', () => {
    expect(calcularProgreso(333, 1000)).toBe(33);
    expect(calcularProgreso(666, 1000)).toBe(67);
  });
});

describe('obtenerEstadoMecenazgo', () => {
  it('devuelve "Campaña Finalizada" para fechas claramente pasadas', () => {
    expect(obtenerEstadoMecenazgo('2020-01-01')).toBe('Campaña Finalizada');
    expect(obtenerEstadoMecenazgo('2023-06-15')).toBe('Campaña Finalizada');
  });

  it('devuelve "Quedan N días" para fechas claramente futuras', () => {
    const resultado = obtenerEstadoMecenazgo('2099-12-31');
    expect(resultado).toMatch(/^Quedan \d+ días$/);
  });

  it('el número de días devuelto es positivo para el futuro', () => {
    const resultado = obtenerEstadoMecenazgo('2099-12-31');
    const dias = Number(resultado.match(/\d+/)?.[0]);
    expect(dias).toBeGreaterThan(0);
  });

  it('devuelve "Campaña Finalizada" para fechas inválidas (fail-safe)', () => {
    expect(obtenerEstadoMecenazgo('no-es-fecha')).toBe('Campaña Finalizada');
  });
});
