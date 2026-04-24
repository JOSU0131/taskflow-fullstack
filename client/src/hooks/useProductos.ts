import { useState, useMemo, useEffect } from 'react';
import { PRODUCTOS_MOCK } from '../data/mockData';
import type { Categoria } from '../types/miniatures';

// 1. INICIALIZACIÓN CON LOCALSTORAGE
  // En lugar de empezar en 'null', revisamos si hay algo guardado en el navegador
export const useProductos = () => {
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(() => {
    const guardado = localStorage.getItem('hammer-categoria');
    // Si existe, lo devolvemos como el estado inicial; si no, usamos null
    return guardado ? (guardado as Categoria) : null;
  });

const [estaCargando, setEstaCargando] = useState(true);

  // 2. PERSISTENCIA AUTOMÁTICA (Nuevo useEffect)
  useEffect(() => {
    if (categoriaSeleccionada) {
      localStorage.setItem('hammer-categoria', categoriaSeleccionada as string);
    } else {
      // Si es null (botón "Todos"), limpiamos la entrada para no ocupar espacio
      localStorage.removeItem('hammer-categoria'); 
    }  
  }, [categoriaSeleccionada]);



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