# Paso 13. Testing y mejoras

Aquí documento las pruebas manuales que hice, los bugs que encontré, cómo los
resolví y los tests automáticos que añadí como bonus.

## 1. Pruebas manuales

### 1.1 Backend (probado con curl + Swagger UI en /api/docs)

| Caso | Endpoint | Esperado | Resultado |
|------|----------|----------|-----------|
| Listar todo         | GET /api/miniatures | 200 + array | ✅ |
| Detalle existente   | GET /api/miniatures/2 | 200 + objeto | ✅ |
| Detalle inexistente | GET /api/miniatures/999 | 404 + message | ✅ |
| Crear sin título    | POST `{tipo:"VENTA"}` | 400 + message | ✅ |
| Crear VENTA válida  | POST con todos los campos | 201 + objeto | ✅ |
| Crear MECENAZGO     | POST con meta, recaudado, fechaFin | 201 | ✅ |
| Crear TUTORIAL      | POST con duracion, nivel, precio | 201 | ✅ |
| Editar              | PUT /api/miniatures/1 con `{precio:60}` | 200 | ✅ |
| Borrar              | DELETE /api/miniatures/1 | 200 | ✅ |
| Borrar inexistente  | DELETE /api/miniatures/999 | 404 | ✅ |

NOTA: la prueba "Crear sin título" antes (con el bug) devolvía 400 con el mensaje
"Nombre y precio son obligatorios". Ahora devuelve "El título es obligatorio
y debe tener al menos 3 caracteres". El backend habla el mismo idioma que el
frontend.

### 1.2 Frontend (probado en navegador local)

- **Galería (/)** carga correctamente, los skeletons aparecen mientras se conecta
  con el server.
- **Filtros de categoría** funcionan; al recargar, la categoría seleccionada
  persiste (localStorage).
- **Buscador** filtra por título Y autor, no en cada tecla (debounce 250 ms).
- **Estado vacío**: al filtrar por algo que no existe, aparece la card punteada
  con "🔍 Ningún resultado".
- **Card → Detalle**: al hacer click en cualquier card, se navega a
  `/producto/{id}` y se cargan los datos. Probado con los 3 tipos.
- **404**: tanto la ruta `*` como `/producto/id-inventado` muestran mensaje claro.
- **Favoritos**: el corazón de cada card funciona, el contador del navbar se
  actualiza, la página `/favoritos` lista solo los favoritos. Persiste tras
  recargar (localStorage).
- **Formulario nuevo producto**: los 3 tipos crean correctamente con validación
  específica. Tras crear, redirige a la página del nuevo producto.

### 1.3 Responsive (probado con DevTools)

| Ancho | Comportamiento |
|------|----------------|
| 375px (móvil) | Grid 1 columna. Hero compacto. Navbar oculta el link "Forjar". OK. |
| 768px (tablet) | Grid 2 columnas. Hero en bloque grande. OK. |
| 1024px+ | Grid 3 columnas. Layout completo. OK. |
| 1280px+ | Grid 4 columnas. Detalle en 2 columnas. OK. |

NOTA: usé `max-w-6xl mx-auto` para el contenedor maestro como acordamos en el
paso Estética 1, así nunca se estira en monitores 4K.

### 1.4 Errores en consola

- ✅ Sin warnings de React.
- ✅ Sin errores 404 de assets.
- ✅ Sin warnings de "key prop" en listas.
- ✅ Las imágenes externas usan `loading="lazy"`.



## 2. Bugs encontrados y solucionados

### Bug 1 — Backend POST validaba campos que el frontend no enviaba

**Síntoma**: el formulario "Forjar Producto" mostraba el toast verde de éxito
pero al volver a la galería la pieza nueva no aparecía.

**Causa**: en `miniatureController.js` el handler de POST hacía
`const { nombre, precio } = req.body;` y validaba esos. Pero el frontend desde
el principio enviaba `titulo` (alineado con la interfaz `BaseItem`). El backend
respondía 400 silenciosamente. El frontend sí pasaba su validación interna,
mostraba el toast verde, y la pieza no se creaba.

**Por qué no lo vi antes**: el `as any` en `NuevoProducto.tsx` ocultaba el
desajuste de TypeScript. Y el toast verde se mostraba tras la validación cliente,
no tras la respuesta del server.

**Solución**: refactoricé el controller con una función `validarMiniatura(data)`
que valida según el `tipo` y exige los campos correctos (`titulo`, `autor`,
`imagen`, `categoria` + los específicos por tipo). En el frontend quité el
`as any` y construyo un objeto que ya cumple el tipo `HammerItemSinId`.

### Bug 2 — App.tsx duplicaba la lógica de pages/Home.tsx

**Síntoma**: pages/Home.tsx existía pero nadie lo importaba. Toda la lógica
de la home estaba inline en App.tsx.

**Por qué pasó**: en algún paso anterior moví la lógica a Home.tsx pero olvidé
actualizar App.tsx para usar el componente. Quedaron dos versiones.

**Solución**: borré el contenido de App.tsx que duplicaba la home y dejé que
la ruta `/` use `<Home />` (el archivo separado). De paso aproveché para
limpiar App.tsx y ponerle lazy loading.

### Bug 3 — La ruta /producto/:id estaba vacía

**Síntoma**: al hacer click en una card no pasaba nada (porque la card no era
Link). Si escribías `/producto/2` directamente solo veías el texto
"Cargando datos del guerrero...".

**Solución**: nueva página `DetalleProducto.tsx` que carga los datos por id,
maneja los 3 estados de red (cargando/error/datos) y renderiza un layout
completo. Y `MiniaturaCard` ahora es un `<Link>`.

### Bug 4 — Formulario solo creaba VENTAs

**Síntoma**: el modelo soportaba VENTA, MECENAZGO y TUTORIAL pero el formulario
hardcodeaba `tipo: 'VENTA'`. El selector de categoría tenía "Tutorial Pintado"
pero el item se creaba como VENTA igual.

**Solución**: añadí un selector de tipo arriba (3 botones grandes) y los campos
del formulario cambian según la elección. Una sola función `construirItem()`
ensambla el objeto tipado `HammerItemSinId` que se manda al backend.

### Bug 5 — Omit<HammerItem, 'id'> rompía la unión discriminada

**Síntoma**: errores TS2353 en build:
```
Object literal may only specify known properties, and 'precio' does not exist in type 'Omit<HammerItem, "id">'
```

**Causa**: `Omit` aplicado a una unión discriminada no funciona como se espera.
TS "colapsa" la unión y pierde la relación entre `tipo` y los campos específicos.

**Solución**: definí un helper `HammerItemSinId` con conditional type
distributivo:

```ts
export type HammerItemSinId = HammerItem extends infer T
  ? T extends HammerItem
    ? Omit<T, 'id'>
    : never
  : never;
```

Esto fuerza a TS a aplicar `Omit` a cada miembro de la unión por separado,
preservando la unión.



## 3. Tests automáticos (Bonus del enunciado)

### 3.1 Stack de testing
- **Vitest** como test runner (rapidísimo, integrado con Vite, sintaxis Jest-compatible).
- **React Testing Library (RTL)** para tests de componentes (orientado a comportamiento, no a implementación).
- **@testing-library/jest-dom** para matchers como `toBeInTheDocument`.
- **@testing-library/user-event** para simular interacciones realistas.
- **jsdom** como entorno de ejecución (no Node puro).

### 3.2 Configuración

`vite.config.ts` extendido con bloque `test`:

```ts
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  css: false,
}
```

`src/test/setup.ts` importa los matchers globalmente y limpia DOM + localStorage
entre tests para que no se contaminen.

### 3.3 Tests existentes (10 tests, 3 archivos)

**`src/logic/hammerLogic.test.ts`** (3 tests, lógica pura)
- Devuelve un porcentaje entero entre 0 y 100.
- Limita a 100 incluso si recaudado supera la meta.
- Redondea correctamente.

**`src/hooks/useFavoritos.test.ts`** (4 tests, hook con localStorage)
- Arranca vacío si no hay nada guardado.
- toggleFavorito añade y quita.
- Persiste en localStorage tras cada cambio.
- limpiarFavoritos vacía la lista.

**`src/components/MiniaturaCard.test.tsx`** (3 tests, integración con Router + Context)
- Renderiza título, autor, categoría y precio.
- Enlaza a `/producto/:id`.
- Toggle de favorito sin navegar (gracias a `e.preventDefault()`).

### 3.4 Comandos

```bash
npm run test         # Modo watch (interactivo, dev)
npm run test:run     # Una pasada (CI)
```

Resultado actual:
```
✓ src/components/MiniaturaCard.test.tsx (3)
✓ src/hooks/useFavoritos.test.ts (4)
✓ src/logic/hammerLogic.test.ts (3)

Test Files  3 passed
     Tests  10 passed
```



## 4. Mejoras pendientes (para una siguiente iteración)

- Tests de `useProductos` (necesita mockear `fetch` con MSW o equivalente).
- Test de DetalleProducto con un id que devuelva 404.
- Drag & Drop para reordenar favoritos (en pendiente).
- Tests E2E con Playwright (sería un paso siguiente real).
