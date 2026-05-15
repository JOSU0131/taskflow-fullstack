// src/hooks/useFavoritos.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFavoritos } from './useFavoritos';

describe('useFavoritos', () => {
  it('arranca vacío si no hay nada en localStorage', () => {
    const { result } = renderHook(() => useFavoritos());
    expect(result.current.favoritos).toEqual([]);
    expect(result.current.esFavorito('1')).toBe(false);
  });

  it('añade y quita un id (toggle)', () => {
    const { result } = renderHook(() => useFavoritos());

    act(() => result.current.toggleFavorito('mini-42'));
    expect(result.current.esFavorito('mini-42')).toBe(true);
    expect(result.current.favoritos).toContain('mini-42');

    act(() => result.current.toggleFavorito('mini-42'));
    expect(result.current.esFavorito('mini-42')).toBe(false);
  });

  it('persiste los favoritos en localStorage', () => {
    const { result } = renderHook(() => useFavoritos());
    act(() => result.current.toggleFavorito('a'));
    act(() => result.current.toggleFavorito('b'));

    const guardado = JSON.parse(localStorage.getItem('hammer-favoritos') ?? '[]');
    expect(guardado).toEqual(['a', 'b']);
  });

  it('limpiarFavoritos vacía la lista', () => {
    const { result } = renderHook(() => useFavoritos());
    act(() => result.current.toggleFavorito('x'));
    act(() => result.current.limpiarFavoritos());
    expect(result.current.favoritos).toEqual([]);
  });
});
