# Paso 8. Context API: FavoritosContext

El Context API permite compartir datos entre componentes sin pasarlos por
props uno a uno (lo que se llama "prop drilling"). En HammerFlow Forge usé
Context para los favoritos.


## 1. Por qué Context para los favoritos

Los favoritos los necesitan tres partes distintas de la app:

1. **MiniaturaCard** (en la galería y en /favoritos): para pintar el
   corazón rellenado o vacío y para alternar al pulsarlo.
2. **Navbar**: para mostrar el contador de favoritos junto al link.
3. **Página /favoritos**: para listar los items marcados.

Sin Context tendría que pasar `favoritos`, `toggleFavorito`, etc. desde
`App.tsx` → `Navbar`/`Home` → `GridProductos` → `MiniaturaCard` → `FavoritoButton`.
Eso es prop drilling y se vuelve infumable rápido.


## 2. Implementación

```tsx
// src/context/FavoritosContext.tsx
import { createContext, useContext, type ReactNode } from 'react';
import { useFavoritos } from '../hooks/useFavoritos';

type FavoritosContextValue = ReturnType<typeof useFavoritos>;

const FavoritosContext = createContext<FavoritosContextValue | null>(null);

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const value = useFavoritos();
  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritosContext = (): FavoritosContextValue => {
  const ctx = useContext(FavoritosContext);
  if (!ctx) {
    throw new Error('useFavoritosContext debe usarse dentro de <FavoritosProvider>');
  }
  return ctx;
};
```


## 3. Decisiones técnicas explicadas

### 3.1 `createContext<Value | null>(null)` y throw en el hook
El contexto arranca como `null` y el hook tira un error si se usa fuera del
Provider. Esto es para pillar bugs en desarrollo: si por error pongo un
componente que usa favoritos fuera del `<FavoritosProvider>`, veo el error
inmediatamente en consola en lugar de un críptico "Cannot read property
'esFavorito' of null".

### 3.2 `ReturnType<typeof useFavoritos>`
En lugar de redefinir manualmente la interfaz del contexto (`{ favoritos:
string[]; esFavorito: ... }`), uso TypeScript para que la deduzca del
return de `useFavoritos`. Si añado un método al hook, el contexto lo
expone automáticamente.

### 3.3 La lógica vive en el hook, no en el Context
El Provider solo envuelve. Toda la lógica (localStorage, toggle, etc.) está
en `useFavoritos`. Esto permite testear la lógica sin necesidad del
Provider. De hecho, `useFavoritos.test.ts` testea el hook directamente sin
crear un contexto.


## 4. Montaje en App.tsx

```tsx
function App() {
  return (
    <FavoritosProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <Navbar />
          <main className="max-w-6xl mx-auto px-6 pb-16">
            <Suspense fallback={<RouteFallback />}>
              <Routes>{/* ... */}</Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </FavoritosProvider>
  );
}
```

NOTA: el Provider está fuera del Router. Esto es importante: el state de
favoritos sobrevive a cambios de ruta. Si lo metiese dentro de una `<Route>`
concreta, al cambiar de página se reiniciaría.


## 5. Consumo desde un componente

```tsx
// FavoritoButton.tsx
import { useFavoritosContext } from '../context/FavoritosContext';

export const FavoritoButton = ({ id }: { id: string }) => {
  const { esFavorito, toggleFavorito } = useFavoritosContext();
  const activo = esFavorito(id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();    // La card es un Link; evitamos navegar al pulsar el corazón
        e.stopPropagation();
        toggleFavorito(id);
      }}
      aria-pressed={activo}
      aria-label={activo ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      {/* SVG de corazón */}
    </button>
  );
};
```


## 6. Cuándo NO usar Context

Context API es excelente PERO causa que TODOS los componentes consumidores
se rerendericen cuando cambia el value. Para datos que cambian muy a
menudo (ej: posición del ratón, cada tecla del teclado), Context puede dar
problemas de performance.

En HammerFlow Forge no es problema: los favoritos cambian solo cuando el
usuario pulsa un corazón (eventos espaciados). Pero para algo como un
formulario complejo con muchos campos, prefiero un useState local o una
librería como Zustand.

Regla general: Context para estado **compartido y de baja frecuencia**.


---

# Actualización: FavoritosContext implementado

## El qué

`src/context/FavoritosContext.tsx` expone los favoritos a TODA la app.
Lo necesitan: la `MiniaturaCard` (para pintar el corazón rellenado o vacío),
el `Navbar` (para el contador) y la página `/favoritos` (para listar).

## El cómo

```tsx
const FavoritosContext = createContext<Value | null>(null);

export const FavoritosProvider = ({ children }) => {
  const value = useFavoritos(); // El hook que gestiona la lógica
  return (
    <FavoritosContext.Provider value={value}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritosContext = () => {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error('Debe usarse dentro de <FavoritosProvider>');
  return ctx;
};
```

NOTA: el `null` inicial + el throw del hook hacen que si por error consumes
el contexto fuera del Provider, el error es inmediato y claro en consola
en lugar de un críptico "cannot read property of null".

## Dónde se monta

En `App.tsx`, FUERA del Router:
```tsx
<FavoritosProvider>
  <Router>
    <Navbar />
    <Routes> ... </Routes>
  </Router>
</FavoritosProvider>
```

¿Por qué fuera del Router? Para que el state de favoritos sobreviva a los
cambios de ruta. Si lo metiese dentro del Router en una página concreta,
al cambiar de página perdería el estado.

## ¿Por qué Context y no pasar props?

Los favoritos los consumen 3 puntos lejanos del árbol:
- App → Navbar (necesita el contador)
- App → Routes → Home → GridProductos → MiniaturaCard → corazón
- App → Routes → Favoritos (necesita la lista)

Pasar `favoritos` y `toggleFavorito` por props desde App hasta cada
nieto sería **prop drilling**: pasar props "de paso" por componentes
intermedios que no las usan, solo para que lleguen abajo. Un infierno
de mantener.

## ¿Por qué Context para esto y no para los productos?

Los productos cambian (se cargan, se filtran, se buscan). Si los metiera
en Context, cada componente que consuma el Context se re-renderiza al
cambiar cualquier producto. Sería un cuello de botella de rendimiento.

Los favoritos cambian POCO (solo cuando el usuario hace click en un
corazón) y los necesitan COMPONENTES MUY DISPERSOS. Encaja perfecto.



---

# Refinamiento (auditoría post-implementación)

Tras pasar el linter (`npm run lint`), saltó el aviso
`react-refresh/only-export-components`: un mismo archivo no debería exportar
componentes Y otras cosas (createContext, hooks), porque rompe el Fast Refresh
de Vite.

**Solución aplicada** (estructura final):
```
src/
├── context/
│   ├── favoritosContext.ts       ← createContext + tipo (sin componentes)
│   └── FavoritosProvider.tsx     ← solo el componente Provider
└── hooks/
    └── useFavoritosContext.ts    ← solo el hook
```

Resultado: ESLint sin errores y Fast Refresh funciona perfectamente al
editar el componente. La separación es la convención recomendada por la
comunidad de React/Vite.

