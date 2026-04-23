
import { DateTime } from 'luxon';
import type { HammerItem } from '../types/miniatures';

export const obtenerEstadoMecenazgo = (fechaFin: string): string => {
  const fin = DateTime.fromISO(fechaFin);
  const ahora = DateTime.now();
  
  const diasRestantes = Math.ceil(fin.diff(ahora, 'days').days);
  
  if (diasRestantes <= 0) return "Campaña Finalizada";
  return `Quedan ${diasRestantes} días`;
};

export const calcularProgreso = (recaudado: number, meta: number): number => {
  return Math.min(Math.round((recaudado / meta) * 100), 100);
};