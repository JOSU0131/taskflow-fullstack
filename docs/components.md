# Paso 6. Documentación de Componentes — HammerFlow Forge

Esta versión actualizada cubre todos los componentes del proyecto, incluido
los nuevos del refactor (Hero, Navbar, Buscador, SkeletonCard, FavoritoButton).


## Índice

1. MiniaturaCard
2. GridProductos
3. FavoritoButton
4. Hero
5. Navbar
6. Buscador
7. SkeletonCard / SkeletonGrid


## 1. MiniaturaCard

**Archivo**: `src/components/MiniaturaCard.tsx`
**Props**: `{ item: HammerItem }`

Tarjeta inteligente que muestra información de un producto. Es la pieza
central de la galería y de la página de favoritos.

Decisiones de diseño:
- **Toda la card es un `<Link to={'/producto/'+item.id}>`**. Eso permite
  navegar pulsando en cualquier parte (mejor UX que un botón pequeño "Ver detalle").
- **Renderizado condicional por `item.tipo`** (Unión Discriminada): cada
  tipo tiene su bloque CTA propio.
- **Badge superior con color por tipo**: naranja (VENTA), púrpura
  (MECENAZGO), azul (TUTORIAL). Lectura rápida.
- **`<FavoritoButton>` flotante** arriba a la derecha. Como la card es un
  Link, el botón hace `e.preventDefault()` + `e.stopPropagation()` para no
  navegar al pulsarlo.
- **Hover**: la card se eleva (`-translate-y-1`), el borde se vuelve
  naranja translúcido, y la imagen hace zoom suave (`scale-105`) durante
  500ms.
- **`loading="lazy"`** en las imágenes: el navegador no las descarga hasta
  que están cerca del viewport.


## 2. GridProductos

**Archivo**: `src/components/GridProductos.tsx`
**Props**: `{ items: HammerItem[] }`

Wrapper que organiza las tarjetas en una rejilla responsive:
- 1 columna en móvil
- 2 en sm (640px)
- 3 en lg (1024px)
- 4 en xl (1280px+)

Patrón de **composición de componentes**: el componente padre (Home,
Favoritos) decide qué items pasar; el grid solo se preocupa de pintarlos.


## 3. FavoritoButton (NUEVO)

**Archivo**: `src/components/FavoritoButton.tsx`
**Props**: `{ id: string; size?: number; className?: string }`

Botón corazón reutilizable. Conectado al `FavoritosContext`.

Estados:
- **Inactivo**: borde redondeado, fondo `bg-slate-900/70`, icono outline.
- **Activo**: fondo `bg-orange-500/20`, icono relleno, ligero scale.

Accesibilidad:
- `aria-pressed={activo}` (es un toggle, no un botón normal)
- `aria-label` que cambia según el estado ("Añadir a favoritos" / "Quitar de favoritos")

NOTA: el `aria-pressed` es lo que un lector de pantalla anuncia. Sin él,
el usuario solo oiría "botón" sin saber si está activado o no.


## 4. Hero (NUEVO)

**Archivo**: `src/components/Hero.tsx`

Sección de bienvenida en la home. Decoración "premium" con:
- Gradiente diagonal `from-slate-900 via-slate-900 to-orange-950/40`.
- Dos "glows" difuminados de fondo (`bg-orange-500/20 blur-3xl` y
  `bg-purple-500/10 blur-3xl`) que dan profundidad sin pesar.
- Tipografía grande y `tracking-tighter` para sensación editorial.
- Dos CTAs: "Forjar nueva pieza" (Link a /nuevo) y "Ver galería" (anchor
  a #galeria).

NOTA sobre el "Ver galería": uso `<a href="#galeria">` en lugar de un Link
de React Router porque es navegación dentro de la misma página (scroll).
La galería tiene `id="galeria"` y `scroll-mt-24` para que al hacer scroll
deje espacio para el navbar sticky.


## 5. Navbar (NUEVO)

**Archivo**: `src/components/Navbar.tsx`

Barra superior sticky con:
- **Logo HAMMERFLOW** (Link a /) con la "F" en naranja.
- **Links**: Galería, Favoritos, Forjar.
- **Contador de favoritos**: si hay alguno, aparece un círculo naranja con el número junto al link.
- **Sticky + backdrop-blur**: la barra se queda fija arriba al hacer scroll, con un blur de fondo que deja entrever lo que pasa por detrás (efecto "glass").
- **NavLink** de React Router: el link de la ruta activa cambia a color naranja automáticamente.

Responsive: el link "Forjar" se oculta en móvil para no apretar.


## 6. Buscador (NUEVO)

**Archivo**: `src/components/Buscador.tsx`
**Props**: `{ valor: string; onCambio: (nuevo: string) => void; placeholder? }`

Input de búsqueda controlado. La lógica de debounce vive en `useProductos`,
NO aquí. Este componente solo muestra y avisa de cambios.

Detalles:
- Icono de lupa SVG inline (no librería externa, ahorra peso).
- `type="search"` (algunos navegadores muestran una "x" para limpiar).
- `aria-label` para accesibilidad.


## 7. SkeletonCard / SkeletonGrid (NUEVO)

**Archivo**: `src/components/SkeletonCard.tsx`

Placeholder animado mientras se cargan los datos. Imita la forma de una
`MiniaturaCard` con bloques grises pulsando (`animate-pulse`).

¿Por qué Skeleton en lugar del spinner de antes?
- **Sensación de progreso**: el usuario ve la estructura inminente.
- **Sin "saltos" visuales**: cuando llegan los datos, el layout no
  reflowa porque ya estaba reservado el espacio.
- **Mejor Core Web Vital (CLS)**: Cumulative Layout Shift = 0.

`SkeletonGrid` es una utilidad: `<SkeletonGrid count={8} />` pinta 8
SkeletonCards en el grid responsive.


## Patrones generales del proyecto

1. **Cada componente recibe sus props tipadas** (interface `Props { ... }`)
   y devuelve JSX. Sin lógica de fetch dentro.
2. **Los componentes "tontos" no conocen la API**. La conexión vive en
   páginas (Home, DetalleProducto, Favoritos) o en hooks (useProductos).
3. **Tailwind sin classes mágicas**: priorizo utilidades core. Cuando algo
   se repite mucho, lo extraigo como variable (ej: `inputClass`,
   `labelClass` en NuevoProducto).
4. **Accesibilidad como mínimo**: cada elemento interactivo tiene `aria-*`
   donde tiene sentido. Cada imagen tiene `alt`.


---

# Actualización: Componentes nuevos y mejorados

## MiniaturaCard (refactor)
- Ahora es un `<Link>` a `/producto/:id`. Toda la card es clicable.
- Botón de favorito flotante arriba a la derecha (`stopPropagation` para
  no navegar al pulsarlo).
- Hover suave con `translate-y` y borde naranja.
- Imagen con `loading="lazy"` (mejora First Paint).
- Badge superior con color por tipo (naranja VENTA, púrpura MECENAZGO, azul TUTORIAL).

## GridProductos
Sin cambios en su API. Sigue siendo el contenedor responsive.

## FavoritoButton (NUEVO)
Corazoncito reutilizable. Consume `useFavoritosContext` y renderiza un
SVG inline (sin libraría de iconos para no inflar el bundle).
- `aria-pressed` y `aria-label` dinámicos según estado.
- `e.preventDefault() + e.stopPropagation()` para que pulsarlo dentro
  de un Link no navegue.

## Hero (NUEVO)
Sección de bienvenida con gradiente, glows difuminados y CTAs.
Solo en la home.

## Navbar (NUEVO)
Barra superior sticky con backdrop-blur. Logo + 3 NavLinks (Galería /
Favoritos / Forjar). Contador de favoritos en el link de Favoritos cuando
hay alguno.

## Buscador (NUEVO)
Input de búsqueda controlado con icono SVG de lupa. La lógica de debounce
vive en `useProductos`.

## SkeletonCard / SkeletonGrid (NUEVO)
Placeholders animados que reemplazan al spinner durante la carga. Mejor
UX percibida porque tienen la forma del contenido que va a aparecer.

