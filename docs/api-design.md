# Paso 12. Capa de red en el frontend (cliente de API tipado)

Este documento explica cómo el frontend habla con el backend. Todo pasa por
la **capa de red**: una carpeta `src/api/` y unos tipos en `src/types/api.ts`.


## 1. Por qué una capa de red

Antes era habitual escribir `fetch('/api/miniatures')` directamente en cada
componente. Eso tiene tres problemas:

1. Si cambia la URL de la API, hay que buscar `fetch` en N archivos.
2. Cada componente decide cómo manejar errores. Inconsistente.
3. TS no sabe qué devuelve `fetch` (es `Response`, no `HammerItem[]`).
   Hay que parsear y casting manual cada vez.

Con una capa de red:

1. La URL se define UNA vez (`API_URL`).
2. Todo error pasa por el mismo helper (`processResponse<T>`).
3. Los métodos están tipados: `getAllMiniatures()` devuelve
   `Promise<HammerItem[]>`. Si lo asigno a otro tipo, TS me avisa.


## 2. Tipos comunes (src/types/api.ts)

```ts
export interface ApiErrorBody {
  message: string;
}

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
```

NOTA: que `ApiError` extienda `Error` permite usar `instanceof ApiError` en
cualquier `catch` para distinguir "el server me dijo no" de "hay un fallo
de red". Por ejemplo, en `DetalleProducto.tsx`:

```ts
} catch (err) {
  if (err instanceof ApiError && err.status === 404) {
    setError('Esta pieza no existe o ha sido retirada.');
  } else {
    setError('No se pudo conectar con la forja.');
  }
}
```


## 3. El cliente (src/api/miniatureService.ts)

### 3.1 URL base configurable

```ts
const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const API_URL = `${BASE_URL}/api/miniatures`;
```

NOTA: en local creo un `.env.local` con `VITE_API_URL=http://localhost:4000`.
En Vercel la variable está VACÍA (mismo origen). Esto evita el bug que tuvimos
de "el frontend en producción intenta hablar con localhost".


### 3.2 Helper `processResponse<T>`

```ts
async function processResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return response.json() as Promise<T>;
  }
  let body: ApiErrorBody | null = null;
  try {
    body = await response.json();
  } catch {
    // El backend no devolvió JSON; usaremos solo el status
  }
  const msg = body?.message ?? `Error ${response.status} ${response.statusText}`;
  throw new ApiError(response.status, msg, body);
}
```

¿Por qué es `<T>` genérico?
- `getAllMiniatures` lo llama con `<HammerItem[]>` y obtiene un array tipado.
- `getById` lo llama con `<HammerItem>` y obtiene un único objeto.
- `delete` lo llama con `<{ message: string; id: string }>`.

Una sola función, todos los métodos del servicio se tipan correctamente.


### 3.3 Métodos del servicio

| Método | URL | Devuelve |
|--------|-----|----------|
| `getAllMiniatures()` | GET `/api/miniatures` | `HammerItem[]` |
| `getById(id)` | GET `/api/miniatures/:id` | `HammerItem` |
| `create(mini)` | POST `/api/miniatures` | `HammerItem` |
| `update(id, partial)` | PUT `/api/miniatures/:id` | `HammerItem` |
| `delete(id)` | DELETE `/api/miniatures/:id` | `{message,id}` |


## 4. El tipo `HammerItemSinId`

Un detalle técnico necesario para que `create()` acepte el body sin id:

```ts
// src/types/miniatures.ts
export type HammerItemSinId = HammerItem extends infer T
  ? T extends HammerItem
    ? Omit<T, 'id'>
    : never
  : never;
```

¿Por qué no `Omit<HammerItem, 'id'>` directo? Porque `HammerItem` es una
unión discriminada y `Omit` la colapsa, perdiendo la relación entre `tipo` y
los campos específicos.

Con `HammerItemSinId`, TS sigue sabiendo que un objeto con `tipo: 'VENTA'`
debe tener `precio` y `stock`, no `meta` ni `fechaFin`.


## 5. Los 3 estados de red en la UI

Cualquier componente que llame a la API debe representar visualmente los
tres estados. Convenciones del proyecto:

- **Cargando**:
  - Pequeño: spinner naranja con borde
  - Grande (galería): `<SkeletonGrid count={N} />` (huesos animados con la forma de las cards)
- **Error**:
  - Bloque rojo `bg-red-500/10 border border-red-500 text-red-400` con mensaje
  - Botón "Reintentar conexión" cuando aplique
- **Datos**:
  - Render normal del componente


## 6. Por qué NO uso una librería como TanStack Query

Tendría sentido en un proyecto más grande (caching, retry automático,
invalidación, etc.). En HammerFlow Forge, con 3-4 endpoints y un par de
páginas, añadiría más complejidad de la que ahorra. La regla que sigo:
añadir librerías solo cuando el dolor de NO tenerlas se note. Aquí no se
nota.


---

# Actualización: Capa de red completa con ApiError tipado

## ApiError (src/types/api.ts)

Antes los errores se "perdían" como strings genéricos. Ahora hay una clase
propia que viaja con la información del error:

```ts
export class ApiError extends Error {
  public status: number;       // Código HTTP (404, 400, ...)
  public body: ApiErrorBody | null;  // Lo que devolvió el server: { message }
}
```

¿Por qué extender `Error`? Para poder hacer:

```ts
try {
  await miniatureService.getById(id);
} catch (err) {
  if (err instanceof ApiError && err.status === 404) {
    setError('Esta pieza no existe');
  } else {
    setError('Error de red');
  }
}
```

## processResponse — el helper que centraliza errores

En `miniatureService.ts` hay una función helper que TODOS los métodos del
servicio usan:

```ts
async function processResponse<T>(response: Response): Promise<T> {
  if (response.ok) return response.json() as Promise<T>;
  let body = null;
  try { body = await response.json(); } catch {}
  const msg = body?.message ?? `Error ${response.status}`;
  throw new ApiError(response.status, msg, body);
}
```

Ventajas:
- El "if (!response.ok)" no se repite en cada método.
- Cualquier error viaja siempre como `ApiError` con su status.
- TS sabe el tipo del retorno gracias al genérico `<T>`.

## URL configurable con variables de entorno

```ts
const BASE_URL = import.meta.env.VITE_API_URL ?? '';
const API_URL = `${BASE_URL}/api/miniatures`;
```

- En desarrollo: `VITE_API_URL=http://localhost:4000` en `.env.local`
- En producción (Vercel monorepo): variable vacía → mismo origen, las
  rewrites de `vercel.json` redirigen `/api/*` al backend automáticamente.

## HammerItemSinId (helper distributivo)

Necesario para `create()` que recibe un item sin id. `Omit<HammerItem, 'id'>`
no funciona bien con uniones discriminadas. La solución:

```ts
export type HammerItemSinId = HammerItem extends infer T
  ? T extends HammerItem
    ? Omit<T, 'id'>
    : never
  : never;
```

NOTA: este patrón se llama "distributive conditional type" en TS. Aplica el
`Omit` a CADA miembro de la unión por separado en lugar de colapsarla.

## Estados de red en la UI

Los 3 estados que pide el paso 12 se manejan en cada hook/página:
- `estaCargando: boolean` → muestra `<SkeletonGrid />` o spinner
- `error: string | null` → muestra card roja con botón "Reintentar"
- `productos / item: HammerItem[] | null` → renderiza el contenido real

