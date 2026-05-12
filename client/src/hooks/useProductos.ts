// src/hooks/useProductos.ts
// Hook principal que maneja la lista de miniaturas.
// Responsabilidades:
//   - Cargar productos desde la API
//   - Estados de red (cargando / error / datos)
//   - Filtro por categoría (persistido en localStorage)
//   - Búsqueda por título/autor (con debounce)
//
// NOTA: solo el FILTRO de UI vive en localStorage (preferencia visual del
// usuario). Los productos en sí son fuente de verdad del backend, como pide
// el paso 12 del enunciado.

import { useState, useMemo, useEffect } from 'react';
import { miniatureService } from '../api/miniatureService';
import type { Categoria, HammerItem } from '../types/miniatures';
import { useDebounce } from './useDebounce';

export const useProductos = () => {
  const [productos, setProductos] = useState<HammerItem[]>([]);

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(() => {
    const guardado = localStorage.getItem('hammer-categoria');
    return guardado ? (guardado as Categoria) : null;
  });

  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebounce(busqueda, 250);

  const [estaCargando, setEstaCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Persistencia de la categoría seleccionada (preferencia de UI)
  useEffect(() => {
    if (categoriaSeleccionada) {
      localStorage.setItem('hammer-categoria', categoriaSeleccionada);
    } else {
      localStorage.removeItem('hammer-categoria');
    }
  }, [categoriaSeleccionada]);

  // Carga inicial desde la API
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setEstaCargando(true);
        setError(null);
        const data = await miniatureService.getAllMiniatures();
        setProductos(data);
      } catch {
        setError('No se pudo conectar con la forja (Servidor offline)');
      } finally {
        setEstaCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  // Filtrado: combina categoría + búsqueda. useMemo evita recalcular en
  // cada re-render que no toque estas tres dependencias.
  const productosFiltrados = useMemo(() => {
    let resultado = productos;

    if (categoriaSeleccionada) {
      resultado = resultado.filter(item => item.categoria === categoriaSeleccionada);
    }

    if (busquedaDebounced.trim()) {
      const q = busquedaDebounced.trim().toLowerCase();
      resultado = resultado.filter(
        item =>
          item.titulo.toLowerCase().includes(q) ||
          item.autor.toLowerCase().includes(q)
      );
    }

    return resultado;
  }, [productos, categoriaSeleccionada, busquedaDebounced]);

  return {
    productos,
    productosFiltrados,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    busqueda,
    setBusqueda,
    estaCargando,
    error,
  };
};
