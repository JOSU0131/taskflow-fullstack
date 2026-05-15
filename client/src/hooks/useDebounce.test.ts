// src/hooks/useDebounce.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('devuelve el valor inicial inmediatamente sin esperar', () => {
    const { result } = renderHook(() => useDebounce('hola', 300));
    expect(result.current).toBe('hola');
  });

  it('no actualiza el valor antes de que expire el delay', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'inicial' } }
    );
    rerender({ val: 'nuevo' });
    // Solo han pasado 100ms de los 300ms requeridos
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe('inicial');
  });

  it('actualiza el valor cuando expira el delay completo', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'inicial' } }
    );
    rerender({ val: 'nuevo' });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('nuevo');
  });

  it('cancela actualizaciones intermedias — solo el último valor importa', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 300),
      { initialProps: { val: 'a' } }
    );
    rerender({ val: 'b' });
    rerender({ val: 'c' });
    rerender({ val: 'd' });
    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('d');
  });

  it('respeta el delay personalizado (500ms)', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: string }) => useDebounce(val, 500),
      { initialProps: { val: 'antes' } }
    );
    rerender({ val: 'después' });
    act(() => { vi.advanceTimersByTime(499); });
    expect(result.current).toBe('antes');
    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toBe('después');
  });

  it('funciona con tipos no-string (número)', () => {
    const { result, rerender } = renderHook(
      ({ val }: { val: number }) => useDebounce(val, 200),
      { initialProps: { val: 0 } }
    );
    rerender({ val: 42 });
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current).toBe(42);
  });
});
