// Tipos comunes para la capa de red

/**
 * Estructura de error que devuelve el backend cuando algo va mal.
 * Ejemplo: { message: "El título es obligatorio..." }
 */
export interface ApiErrorBody {
  message: string;
}

/**
 * Error personalizado que lanza nuestro cliente de API.
 * Tiene .status (código HTTP) y .body (lo que devolvió el server).
 */
export class ApiError extends Error {
  public status: number;
  public body: ApiErrorBody | null;

  constructor(status: number, message: string, body: ApiErrorBody | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}
