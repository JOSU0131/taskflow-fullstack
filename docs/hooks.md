# Paso 7. Hooks de React

Los hooks son funciones especiales que solo pueden llamarse dentro de
componentes funcionales (o de otros hooks). Permiten "engancharse" al
estado y al ciclo de vida de React sin escribir clases.

En HammerFlow Forge uso:
- Hooks built-in: `useState`, `useEffect`, `useMemo`, `useCallback`, `useContext`, `useParams`, `useNavigate`
- Custom hooks propios: `useProductos`, `useFavoritos`, `useDebounce`


## 1. Hooks fundamentales utilizados

### useState
Para controlar interactividad. Permite que React "recuerde" valores entre
renders y se repinte cuando cambian.

Ejemplos en el proyecto:
- `useState<HammerItem[]>([])` en useProductos para guardar el catálogo
- `useState(false)` en NuevoProducto para `enviando`
- `useState<Categoria | null>(null)` para la categoría seleccionada

### useEffect
Para efectos secundarios: peticiones HTTP, suscripciones, sincronización con
APIs del navegador (localStorage), etc.

Ejemplos en el proyecto:
- Carga inicial de productos en `useProductos` (con dependencias `[]`)
- Persistencia de la categoría en localStorage cuando cambia
- Limpieza del timeout en `useDebounce` (con función de cleanup)

### useMemo
Para evitar recalcular cosas costosas en cada render. Solo recalcula si
cambia alguna de sus dependencias.

Ejemplo: `productosFiltrados` en `useProductos` se recalcula solo si cambia
`productos`, `categoriaSeleccionada` o `busquedaDebounced`.

### useCallback
Para evitar que una función se recree en cada render. Útil cuando esa
función se pasa como prop a un componente hijo memoizado, o se usa como
dependencia de otro hook.

Ejemplo: `esFavorito` y `toggleFavorito` en `useFavoritos`.

### useContext
Para consumir un contexto. Lo usamos en `useFavoritosContext`.


## 2. Custom Hook 1: `useProductos`

Lógica central de la galería: carga, estado de red, filtros y búsqueda.

```ts
const {
  productosFiltrados,    // Los items filtrados por categoría + búsqueda
  categoriaSeleccionada, // null o una Categoria
  setCategoriaSeleccionada,
  busqueda,
  setBusqueda,
  estaCargando,          // boolean
  error,                 // string | null
} = useProductos();
```

Internamente compone tres responsabilidades:
1. Carga inicial vía `miniatureService.getAllMiniatures()` (un useEffect).
2. Persistencia de la categoría seleccionada en localStorage (otro useEffect).
3. Filtrado memoizado: combina categoría + búsqueda con debounce.

NOTA: encapsular toda esta complejidad en un hook hace que `Home.tsx` solo
tenga que pintar resultados, sin pelearse con fetch ni filtros.


## 3. Custom Hook 2 (Bonus): `useFavoritos`

Gestiona la lista de ids favoritos con persistencia en localStorage.

```ts
const {
  favoritos,         // string[] de ids
  esFavorito,        // (id: string) => boolean
  toggleFavorito,    // (id: string) => void
  limpiarFavoritos,  // () => void
} = useFavoritos();
```

Implementación clave:

```ts
const [favoritos, setFavoritos] = useState<string[]>(() => leerFavoritos());

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
}, [favoritos]);

const toggleFavorito = useCallback((id: string) => {
  setFavoritos(prev =>
    prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
  );
}, []);
```

NOTA importante: solo los IDs viven en localStorage. Los datos completos
siguen siendo fuente de verdad del backend. Si el server elimina una
miniatura, su id favorito simplemente "no encuentra match" cuando vamos a
la página /favoritos. Esto evita tener datos desincronizados.


## 4. Custom Hook 3 (Bonus): `useDebounce<T>`

Hook genérico que retrasa la actualización de un valor. Lo usa el buscador
para no filtrar en cada tecla pulsada (sería ineficiente y daría tirones
visuales).

```ts
export function useDebounce<T>(valor: T, delayMs: number = 300): T {
  const [valorDebounced, setValorDebounced] = useState<T>(valor);

  useEffect(() => {
    const timeoutId = setTimeout(() => setValorDebounced(valor), delayMs);
    return () => clearTimeout(timeoutId); // Cancela si el valor cambia antes
  }, [valor, delayMs]);

  return valorDebounced;
}
```

Uso:
```ts
const [texto, setTexto] = useState('');
const textoDebounced = useDebounce(texto, 250);
// textoDebounced solo se actualiza 250ms después de la última pulsación
```

NOTA: la función de cleanup del useEffect es la pieza clave. Cada vez que
el usuario teclea, se cancela el setTimeout anterior. Solo cuando deja de
teclear durante 250ms, el setTimeout completa y `setValorDebounced` corre.


## 5. Por qué los custom hooks importan

Antes de los custom hooks, la lógica como "carga + filtra + persiste" se
escribía directamente en el componente. Resultados:
- El componente era enorme y mezclaba presentación con lógica.
- Difícil de reusar.
- Difícil de testear (necesitas renderizar el componente para probar la lógica).

Con custom hooks:
- El componente queda corto y enfocado en pintar.
- La lógica se reusa (ej: `useDebounce` lo podría usar otro buscador en otra parte).
- Se testea sin pintar nada (ver `useFavoritos.test.ts`).


---

# Actualización: Custom hooks finales

## useProductos (refactorizado)

Sigue siendo el hook principal de la galería pero ahora también gestiona
la búsqueda con debounce.

Devuelve:
- `productos`, `productosFiltrados`
- `categoriaSeleccionada`, `setCategoriaSeleccionada`
- `busqueda`, `setBusqueda` (NUEVO)
- `estaCargando`, `error`

NOTA: el filtrado combina categoría + búsqueda en un único `useMemo` que
solo se recalcula cuando alguna de las 3 dependencias cambia (productos,
categoriaSeleccionada, busquedaDebounced).

## useFavoritos (Bonus: segundo custom hook)

Hook que gestiona la lista de ids favoritos del usuario con persistencia
en localStorage.

Devuelve:
- `favoritos: string[]` — los ids guardados
- `esFavorito(id): boolean`
- `toggleFavorito(id)`
- `limpiarFavoritos()`

Decisión técnica: solo guardamos los ids. Los datos completos siempre vienen
del backend. Si una pieza se borra del server, el id favorito simplemente no
encuentra match y desaparece visualmente.

Lo envolvemos en `FavoritosContext` para que cualquier componente del árbol
pueda consumirlo sin prop drilling.

## useDebounce<T>(valor, delayMs?)

Hook genérico de utilidad. Retrasa la actualización del valor X ms.

```ts
const [texto, setTexto] = useState('');
const textoDebounced = useDebounce(texto, 250);
```

Implementación: `useEffect` con `setTimeout` y cleanup que cancela el
timeout anterior si el valor cambia antes de que expire.

Ventajas frente a hacerlo "a mano" en cada componente:
- Reutilizable (lo usamos en useProductos para el buscador, podríamos
  usarlo en cualquier otro filtro en tiempo real).
- Genérico con `<T>`: funciona con strings, números o lo que sea.
- Sin dependencias externas.

