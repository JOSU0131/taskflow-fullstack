import { useState, useMemo, useEffect } from 'react';
import { PRODUCTOS_MOCK } from '../data/mockData';
import type { Categoria } from '../types/miniatures';

export const useProductos = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [estaCargando, setEstaCargando] = useState(true);

  // SIMULACIÓN DE CARGA (useEffect)
  // Usamos useEffect para simular que los datos vienen de una base de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setEstaCargando(false);
    }, 1200); // 1.2 segundos de "Loading"

    return () => clearTimeout(timer); // Limpieza del efecto
  }, []);

  // FILTRADO OPTIMIZADO (useMemo)
  const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return PRODUCTOS_MOCK;
    return PRODUCTOS_MOCK.filter(item => item.categoria === categoriaSeleccionada);
  }, [categoriaSeleccionada]);

  return {
    productosFiltrados,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    estaCargando
  };
};