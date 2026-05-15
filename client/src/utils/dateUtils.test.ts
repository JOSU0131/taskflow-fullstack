// src/utils/dateUtils.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { obtenerDiasDesde } from './dateUtils';

describe('obtenerDiasDesde', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fijamos "hoy" al mediodía UTC para evitar problemas de zona horaria
    vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
  });
  afterEach(() => { vi.useRealTimers(); });

  it('devuelve 0 para la fecha de hoy', () => {
    // Hoy es 2026-06-15; la diferencia debe ser < 1 día → floor = 0
    expect(obtenerDiasDesde('2026-06-15')).toBe(0);
  });

  it('devuelve los días correctos para una fecha pasada reciente', () => {
    expect(obtenerDiasDesde('2026-06-10')).toBe(5);
  });

  it('devuelve los días correctos para una fecha más lejana', () => {
    // 2026-01-15 → ~150 días antes de 2026-06-15
    const dias = obtenerDiasDesde('2026-01-15');
    expect(dias).toBeGreaterThan(100);
    expect(dias).toBeLessThan(200);
  });

  it('devuelve 0 para fechas inválidas (operador || actúa de fallback)', () => {
    expect(obtenerDiasDesde('no-es-fecha')).toBe(0);
    expect(obtenerDiasDesde('')).toBe(0);
  });

  it('devuelve un entero (sin decimales)', () => {
    const resultado = obtenerDiasDesde('2026-06-01');
    expect(Number.isInteger(resultado)).toBe(true);
  });
});
