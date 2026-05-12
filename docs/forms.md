# Paso 10. Formularios e Interacción (refactor a 3 tipos)

El formulario de "Forjar nueva pieza" (`/nuevo`) es donde la web deja de
ser una "galería para mirar" y se convierte en una "herramienta para
trabajar". Esta versión cubre los **3 tipos** del catálogo (VENTA,
MECENAZGO, TUTORIAL).


## 1. Concepto clave: Componentes Controlados

En React, los formularios son "controlados". Cada letra que el usuario
escribe se guarda inmediatamente en el estado (useState). React es el
dueño absoluto de lo que aparece en pantalla.

Patrón básico:

```tsx
const [nombre, setNombre] = useState('');

<input
  value={nombre}                              // ← controlado por React
  onChange={(e) => setNombre(e.target.value)} // ← cualquier cambio actualiza el estado
/>
```

NOTA: si pongo solo `value=` sin `onChange=`, el input es de "solo lectura".
Si pongo solo `onChange=` sin `value=`, es un input "no controlado". Lo
correcto es ambos.


## 2. La estructura del formulario refactorizado

```
┌─────────────────────────────────────────┐
│  Selector de TIPO (3 botones grandes)    │  ← VENTA / MECENAZGO / TUTORIAL
├─────────────────────────────────────────┤
│  Título                                  │  ← común a los 3 tipos
│  Autor              Categoría            │
│  URL de imagen                           │
├─────────────────────────────────────────┤
│  CAMPOS DINÁMICOS según el tipo:        │  ← cambian según el botón pulsado
│   VENTA      → precio, stock             │
│   MECENAZGO  → meta, recaudado, fechaFin │
│   TUTORIAL   → precio, duración, nivel   │
├─────────────────────────────────────────┤
│  Mensaje de error (si lo hay)            │
│  [ Forjar Producto ]                     │
└─────────────────────────────────────────┘
```


## 3. Renderizado condicional de los campos

```tsx
{tipo === 'VENTA' && (
  <div className="grid grid-cols-2 gap-4">
    <input ... />  {/* precio */}
    <input ... />  {/* stock */}
  </div>
)}

{tipo === 'MECENAZGO' && (
  <div className="grid grid-cols-3 gap-4">
    <input ... />  {/* meta */}
    <input ... />  {/* recaudado */}
    <input type="date" ... />  {/* fechaFin */}
  </div>
)}

{tipo === 'TUTORIAL' && (
  <div className="grid grid-cols-3 gap-4">
    <input ... />     {/* precio */}
    <input ... />     {/* duracion */}
    <select ... />    {/* nivel: Básico/Intermedio/Avanzado */}
  </div>
)}
```


## 4. Construcción tipada del item

Antes había un `as any` que ocultaba el bug del tipo VENTA forzado. Ahora
una función pura construye el objeto correcto:

```ts
const construirItem = (): HammerItemSinId | null => {
  // Validaciones comunes (titulo, autor, imagen, categoria)
  // ...

  if (tipo === 'VENTA') {
    return { ...base, tipo: 'VENTA', precio: p, stock: s };
  }
  if (tipo === 'MECENAZGO') {
    return { ...base, tipo: 'MECENAZGO', meta: m, recaudado: r, fechaFin };
  }
  // TUTORIAL
  return { ...base, tipo: 'TUTORIAL', precio: p, duracion, nivel };
};
```

NOTA: el tipo de retorno es `HammerItemSinId` (ver `types/miniatures.ts`),
que es la unión distributiva `Omit<...>`. Si me equivoco mezclando campos
(ej: poner `meta` en la rama VENTA), TypeScript me lo dice.


## 5. Validación en dos niveles

1. **Cliente (en `construirItem`)**: longitud mínima del título, precio > 0,
   fecha válida, etc. Mensajes inmediatos sin red.
2. **Servidor (en `validarMiniatura`)**: misma validación pero en el
   backend. Es la "segunda línea de defensa": si alguien hace POST desde
   `curl` saltándose el formulario, el servidor sigue validando.

Si la validación servidor falla, el frontend muestra el `err.message` real
(gracias a `ApiError`).


## 6. UX de éxito: redirección automática

Antes el formulario mostraba un toast verde y limpiaba los campos. Ahora,
tras crear con éxito:

```ts
const creada = await miniatureService.create(item);
navigate(`/producto/${creada.id}`);
```

Esto da dos beneficios:
1. El usuario ve la pieza recién creada con todos sus datos.
2. Se confirma que la pieza realmente existe en el backend (no como
   antes, que mostraba el OK aunque la persistencia hubiese fallado).


## 7. Accesibilidad

- Todos los inputs tienen `<label>` asociado (mejora screen readers).
- El botón submit tiene `disabled={enviando}` y cambia el texto a
  "Forjando..." durante el await. Evita doble-submit.
- Uso `noValidate` en el `<form>` porque mi validación es manual y más
  explícita que la del navegador.
