# Paso 9. Rutas y navegación

## ¿Qué es react-router-dom?

Es la librería estándar para manejar la navegación en aplicaciones de una
sola página (SPA). Sin ella, para ir de una página a otra el navegador
tendría que recargar toda la web (lento y poco profesional). Con ella, el
cambio de página es instantáneo y fluido.

¿Para qué sirve exactamente en HammerFlow Forge?

- **URLs lógicas**:
  - `/` (Galería de miniaturas)
  - `/producto/123` (Detalle de una miniatura)
  - `/nuevo` (Formulario de Forjar nueva pieza)
  - `/favoritos` (Tu colección)
  - cualquier otra → 404

- **Sincronización con la barra de direcciones**: el usuario puede usar
  los botones de "Atrás" / "Adelante" del navegador sin que la app se
  rompa.

- **Carga condicional**: en lugar de renderizar todo a la vez, solo se
  pinta el componente correspondiente a la URL actual.


## 1. Instalación

```bash
cd client
npm install react-router-dom
```


## 2. Rutas finales del proyecto

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `Home` | Galería + buscador + filtros |
| `/producto/:id` | `DetalleProducto` | Detalle, CTA específico por tipo |
| `/nuevo` | `NuevoProducto` | Formulario de los 3 tipos |
| `/favoritos` | `Favoritos` | Items marcados como favoritos |
| `*` | `NotFound` | 404 personalizado |


## 3. Implementación con lazy loading

```tsx
// src/App.tsx
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const DetalleProducto = lazy(() => import('./pages/DetalleProducto'));
const NuevoProducto = lazy(() => import('./pages/NuevoProducto'));
const Favoritos = lazy(() => import('./pages/Favoritos'));
const NotFound = lazy(() => import('./pages/NotFound'));

<Router>
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/producto/:id" element={<DetalleProducto />} />
      <Route path="/nuevo" element={<NuevoProducto />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
</Router>
```

NOTA: `lazy` + `Suspense` permite que cada página viaje en su propio chunk
de JavaScript. El navegador solo descarga el código de la página que se
visita. Esto es el "code-splitting" del bonus.


## 4. Cómo navegar dentro de la app

### 4.1 `<Link>`: equivalente a `<a>` pero sin recargar

```tsx
import { Link } from 'react-router-dom';

<Link to="/nuevo">Forjar nueva pieza</Link>
```

### 4.2 `<NavLink>`: como Link pero sabe si la ruta está activa

```tsx
<NavLink
  to="/favoritos"
  className={({ isActive }) => isActive ? 'text-orange-500' : 'text-slate-400'}
>
  Favoritos
</NavLink>
```

NOTA: lo uso en `Navbar.tsx` para resaltar el link de la página actual.

### 4.3 `useNavigate`: navegar programáticamente

```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
// ...
const creada = await miniatureService.create(item);
navigate(`/producto/${creada.id}`);
```

NOTA: lo uso en `NuevoProducto.tsx` después de crear con éxito.

### 4.4 `useParams`: leer parámetros de la URL

```tsx
import { useParams } from 'react-router-dom';

// En la ruta /producto/:id
const { id } = useParams<{ id: string }>();
```

NOTA: lo uso en `DetalleProducto.tsx` para saber qué pieza cargar.


## 5. La página 404

Cuando React Router no encuentra una ruta, cae en el `path="*"`. Mi
componente `NotFound` muestra un 404 temático ("Te has adentrado demasiado
en la Disformidad") con un botón Link a `/`.


## 6. Despliegue: el truco del `vercel.json`

Vercel sirve archivos estáticos desde `dist/`. Si un usuario accede
directamente a `/favoritos` (refrescando la página o pegando la URL),
Vercel busca un archivo `favoritos.html` que no existe y devuelve 404.

Solución: las "rewrites" del `vercel.json`:

```json
"rewrites": [
  { "source": "/api/(.*)", "destination": "server/index.js" },
  { "source": "/(.*)", "destination": "client/$1" }
]
```

Combinado con la config `@vercel/static-build` del `client`, esto hace
que cualquier ruta no-API caiga en `index.html`, y entonces React Router
toma el relevo y muestra la página correcta.
