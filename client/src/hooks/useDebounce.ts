// src/hooks/useDebounce.ts
// Hook utilitario: retrasa la actualización de un valor.
// Útil para que el buscador no filtre en cada tecla pulsada.
//
// Ejemplo:
//   const [texto, setTexto] = useState('');
//   const textoDebounced = useDebounce(texto, 300); // espera 300ms
//   useEffect(() => filtrar(textoDebounced), [textoDebounced]);

import { useEffect, useState } from 'react';

export function useDebounce<T>(valor: T, delayMs: number = 300): T {
  const [valorDebounced, setValorDebounced] = useState<T>(valor);

  useEffect(() => {
    const timeoutId = setTimeout(() => setValorDebounced(valor), delayMs);
    // Si el usuario sigue escribiendo, cancelamos el timeout pendiente
    return () => clearTimeout(timeoutId);
  }, [valor, delayMs]);

  return valorDebounced;
}
