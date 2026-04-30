import { useState, useMemo, useEffect } from 'react';
import { miniatureService } from '../api/miniatureService'; // Importamos el servicio real BORRAMOS EL MOCK
import type { Categoria, HammerItem } from '../types/miniatures';

// 1. INICIALIZACIÓN CON LOCALSTORAGE
  // En lugar de empezar en 'null', revisamos si hay algo guardado en el navegador
export const useProductos = () => {

const [productos, setProductos] = useState<HammerItem[]>([]); // Ahora empezamos con un array vacío
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(() => {
    const guardado = localStorage.getItem('hammer-categoria');
    // Si existe, lo devolvemos como el estado inicial; si no, usamos null
    return guardado ? (guardado as Categoria) : null;
  });

const [estaCargando, setEstaCargando] = useState(true);
const [error, setError] = useState<string | null>(null); // AÑADIMOS Paso 12

  // 2. PERSISTENCIA AUTOMÁTICA (Nuevo useEffect)
  useEffect(() => {
    if (categoriaSeleccionada) {
      localStorage.setItem('hammer-categoria', categoriaSeleccionada as string);
    } else {
      // Si es null (botón "Todos"), limpiamos la entrada para no ocupar espacio
      localStorage.removeItem('hammer-categoria'); 
    }  
  }, [categoriaSeleccionada]);

  // SIMULACIÓN DE CARGA (useEffect)  BORRADO EN PASO 12, YA NO SIMULAMOS CARGA, SINO QUE REALMENTE TRAEMOS LOS DATOS DESDE EL BACKEND
  // 3. CARGA REAL DE DATOS (Sustituye a tu simulación de 1.2s)
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setEstaCargando(true);
        setError(null);
        // Llamamos a la API real
        const data = await miniatureService.getAllMiniatures();
        setProductos(data);
      } catch (err) {
        // Si el servidor está apagado, saltará aquí
        setError('No se pudo conectar con la forja (Servidor offline)');
      } finally {
        setEstaCargando(false);
      }
    };

    obtenerDatos();
  } , []); // Solo se ejecuta una vez al montar el componente 



  // FILTRADO OPTIMIZADO (useMemo)  ACTUAZLIZADO PARA USAR LOS DATOS REALES EN LUGAR DE MOCK
  // 4. FILTRADO (Ahora usa 'productos' de la API en vez de MOCK)

  const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return productos;
    return productos.filter(item => item.categoria === categoriaSeleccionada);
  }, [categoriaSeleccionada, productos]); // Añadimos 'productos' a las dependencias

  return {
    productosFiltrados,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    estaCargando,
    error   // Lo devolvemos para que App.tsx no de error
  };
};