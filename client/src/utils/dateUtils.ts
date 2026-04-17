import { DateTime } from 'luxon';

/**
 * Calcula los días transcurridos desde una fecha ISO hasta hoy.
 * Demuestra el uso de una librería externa con tipos (@types/luxon).
 */
export const obtenerDiasDesde = (fechaISO: string): number => {
  const fecha = DateTime.fromISO(fechaISO);
  const hoy = DateTime.now();

  // El método .diff puede devolver NaN si la fecha es inválida
  const diferencia = hoy.diff(fecha, 'days').days;

  // Usamos el operador || para asegurar que siempre devolvemos un número
  return Math.floor(diferencia || 0);
};