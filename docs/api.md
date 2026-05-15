# Paso 11. Backend y API

El backend es el cerebro central (servidor) donde se guardan los datos para
que sean accesibles desde cualquier parte del mundo por cualquier usuario,
en cualquier navegador.

En esta versión refactorizada, el backend tiene tres responsabilidades
claras:
1. Almacenar el catálogo de miniaturas (en memoria, por ahora).
2. Validar lo que entra antes de guardarlo (segunda línea de defensa después de la validación cliente).
3. Documentarse a sí mismo con Swagger/OpenAPI.


## 1. Arquitectura por capas

```
server/
  index.js                   ← Punto de entrada (middlewares + Swagger + montar rutas)
  swagger.js                 ← Especificación OpenAPI 3.0
  routes/miniatures.js       ← Definición de rutas + anotaciones JSDoc
  controllers/
    miniatureController.js   ← Lógica + validación
```

NOTA: `routes/` solo decide qué función llamar para cada verbo+URL.
`controllers/` hace la lógica de negocio. Esa separación de capas es lo que
pide el enunciado: que el día de mañana, si quiero meter una capa de
`services/` (con acceso a base de datos), no tenga que tocar `routes/`.


## 2. Endpoints

| Verbo | Ruta | Acción | Códigos posibles |
|-------|------|--------|-------------------|
| GET | `/api` | Información general | 200 |
| GET | `/api/miniatures` | Lista todas | 200 |
| GET | `/api/miniatures/:id` | Detalle | 200, 404 |
| POST | `/api/miniatures` | Crea nueva | 201, 400 |
| PUT | `/api/miniatures/:id` | Actualiza | 200, 400, 404 |
| DELETE | `/api/miniatures/:id` | Elimina | 200, 404 |

NOTA: el GET por id es nuevo. Antes solo había `getAll`. Lo necesitaba
sí o sí para la página de detalle (`/producto/:id`).


### 2.1 Ejemplos con `curl`

**Listar todas**:
```bash
curl http://localhost:4000/api/miniatures
```

**Detalle por id**:
```bash
curl http://localhost:4000/api/miniatures/2
```

Respuesta 200:
```json
{
  "id": "2",
  "tipo": "MECENAZGO",
  "titulo": "Dragon ancestral - Proyecto de Esculpido",
  "autor": "ForgeMaster",
  "imagen": "...",
  "categoria": "Fantasía",
  "meta": 5000,
  "recaudado": 3200,
  "fechaFin": "2026-08-30"
}
```

Respuesta 404:
```json
{ "message": "No existe ninguna pieza con id 9999" }
```

**Crear VENTA**:
```bash
curl -X POST http://localhost:4000/api/miniatures \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "VENTA",
    "titulo": "Caballero Imperial",
    "autor": "ForgeMaster",
    "imagen": "https://example.com/img.jpg",
    "categoria": "Fantasía",
    "precio": 75,
    "stock": 1
  }'
```

**Crear MECENAZGO**:
```bash
curl -X POST http://localhost:4000/api/miniatures \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "MECENAZGO",
    "titulo": "Goblin King Diorama",
    "autor": "MidasArt",
    "imagen": "https://example.com/img.jpg",
    "categoria": "Monstruos",
    "meta": 3000,
    "recaudado": 0,
    "fechaFin": "2026-12-31"
  }'
```

**Crear TUTORIAL**:
```bash
curl -X POST http://localhost:4000/api/miniatures \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "TUTORIAL",
    "titulo": "OSL para principiantes",
    "autor": "Lumen_Brush",
    "imagen": "https://example.com/img.jpg",
    "categoria": "Tutorial Pintado",
    "precio": 15,
    "duracion": "1.5 horas",
    "nivel": "Básico"
  }'
```


## 3. Validación por tipo (la parte clave)

El controller usa una función `validarMiniatura(data)` que comprueba según
el campo `tipo`:

```js
switch (tipo) {
    case 'VENTA':
        if (precio <= 0) return 'El precio debe ser mayor que 0';
        if (stock < 0) return 'El stock debe ser igual o mayor que 0';
        return null;

    case 'MECENAZGO':
        if (meta <= 0) return 'La meta debe ser mayor que 0';
        if (recaudado < 0) return 'Lo recaudado debe ser igual o mayor que 0';
        if (!Date.parse(fechaFin)) return 'La fecha fin debe ser válida';
        return null;

    case 'TUTORIAL':
        if (precio <= 0) return 'El precio debe ser mayor que 0';
        if (!duracion) return 'La duración es obligatoria';
        if (!['Básico','Intermedio','Avanzado'].includes(nivel))
            return 'El nivel debe ser Básico, Intermedio o Avanzado';
        return null;

    default:
        return 'El tipo debe ser VENTA, MECENAZGO o TUTORIAL';
}
```

NOTA importante: esta función es el espejo del tipo `HammerItem` del
frontend. Si añado un campo nuevo en TypeScript (ej: `descripcion` en
`BaseItem`), debo añadir su validación aquí. No hay forma automática de
mantener ambos sincronizados (sin generadores de código), pero el patrón
ayuda a recordarlo.


## 4. Bug histórico arreglado

Ver `/docs/testing.md` sección "Bug 1". Resumen:

- ANTES: `const { nombre, precio } = req.body;` → siempre 400 porque el frontend envía `titulo`
- AHORA: validación correcta y mensajes específicos por tipo


## 5. Documentación interactiva (Swagger)

Bonus del enunciado: documentación con OpenAPI 3.0.

Acceso:
- Local: `http://localhost:4000/api/docs`
- Producción: `/api/docs` (en el host de Vercel)

JSON puro de la spec:
- `http://localhost:4000/api/docs.json`

Tecnologías:
- `swagger-jsdoc`: lee los comentarios JSDoc de `routes/*.js` y genera la spec
- `swagger-ui-express`: la sirve como interfaz web

NOTA: Swagger UI permite "probar" todos los endpoints desde el navegador,
sin tocar curl. Útil para enseñarle el backend a alguien que no sea
programador.


---

# Actualización: Endpoints completos y documentación Swagger

## Endpoints disponibles

| Método | URL | Body | Respuesta éxito | Errores |
|--------|-----|------|------------------|---------|
| GET | `/api/miniatures` | — | 200 + `HammerItem[]` | — |
| GET | `/api/miniatures/:id` | — | 200 + `HammerItem` | 404 |
| POST | `/api/miniatures` | `HammerItemSinId` | 201 + `HammerItem` creado | 400 |
| PUT | `/api/miniatures/:id` | `Partial<HammerItem>` | 200 + `HammerItem` actualizado | 400, 404 |
| DELETE | `/api/miniatures/:id` | — | 200 + `{message, id}` | 404 |

Además:
- `GET /api` → info de la API (nombre, docs, lista de endpoints)
- `GET /api/docs` → Swagger UI interactivo
- `GET /api/docs.json` → spec OpenAPI 3.0 en JSON

## Validación por tipo (Unión Discriminada)

El backend valida según el campo `tipo` del body:

**VENTA** → exige `precio` > 0, `stock` >= 0, además de los comunes (titulo, autor, imagen, categoria).

**MECENAZGO** → exige `meta` > 0, `recaudado` >= 0, `fechaFin` (fecha ISO válida).

**TUTORIAL** → exige `precio` > 0, `duracion` (string), `nivel` ('Básico'|'Intermedio'|'Avanzado').

NOTA importante (bitácora): antes el controller validaba `nombre` y `precio`,
pero el frontend siempre envió `titulo`. El bug se arregló alineando ambos al
mismo modelo (`BaseItem` → `titulo`).

## Ejemplos de petición

```bash
# GET por id
curl http://localhost:4000/api/miniatures/2

# POST VENTA
curl -X POST http://localhost:4000/api/miniatures \
  -H "Content-Type: application/json" \
  -d '{"tipo":"VENTA","titulo":"Test","autor":"X","imagen":"https://x.com/i.jpg","categoria":"Fantasía","precio":50,"stock":1}'

# POST MECENAZGO
curl -X POST http://localhost:4000/api/miniatures \
  -H "Content-Type: application/json" \
  -d '{"tipo":"MECENAZGO","titulo":"Proyecto X","autor":"X","imagen":"https://x.com/i.jpg","categoria":"Fantasía","meta":5000,"recaudado":0,"fechaFin":"2026-12-31"}'
```

## Forma de los errores

Todos los errores devuelven:
```json
{ "message": "Texto descriptivo del error" }
```

Y un código HTTP coherente:
- 400 → datos inválidos (mostramos `message` en el formulario)
- 404 → no existe el recurso
- 500 → error interno (no debería pasar; si pasa, es bug)

