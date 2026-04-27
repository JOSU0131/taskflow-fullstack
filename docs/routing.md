# Paso 9. Rutas y navegación
## Paso 1. Instalar la librería (dentro de la carpeta client):
    Bash
    npm install react-router-dom

- NOTA: ¿QUE ES REACT-ROUTER-DOM?
    Es la librería estándar para manejar la navegación en aplicaciones de una sola página (SPA). Sin ella, para ir de una página a otra, el navegador tendría que recargar toda la web (lo cual es lento y se ve poco profesional). Con ella, el cambio de página es instantáneo y fluido.
    
    ¿Para qué sirve exactamente en nuestro taskflow "HammerFlow Forge"?
    
        Crear URLs lógicas: Te permite tener rutas como:
            tuweb.com/ (Galería de miniaturas).
            tuweb.com/producto/123 (Detalle de una miniatura específica).
            tuweb.com/carrito (Tu lista de compra).

        Sincronizar la barra de direcciones: Permite que el usuario pueda usar los botones de "Atrás" y "Adelante" del navegador sin que la aplicación se rompa.

        Carga Condicional: En lugar de renderizar todo a la vez, le dice a React: "Si la URL es /carrito, muestra el componente Carrito; si no, escóndelo".


## Paso 2. Preparar las carpetas
Crear una carpeta src/pages para separar lo que son "Componentes" (botones, tarjetas) de lo que son "Páginas" (Home, ProductDetail, NotFound).

- 1. Configuración en App.tsx
    Vamos a importar los componentes necesarios y a estructurar las rutas. El objetivo es que la galería que tenemos ahora sea la "Home" y preparemos el camino para otras páginas.

    Dejando todo el contenido actual (título, filtros y grid) a una "Página de Inicio" y dejar App.tsx solo como el director de orquesta.

    Necesitamos envolver toda tu aplicación en un "vigilante" (router) que escuche la URL del navegador.
    TypeScript
        import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
        // Importa tus componentes aquí
        import Header from './components/Header';
        import Galeria from './components/Galeria'; // Asumiendo que así se llama tu componente de fotos

        function App() {
        return (
            <Router>
            <div className="min-h-screen bg-white">
                <Header />
                
                <main className="container mx-auto px-4 py-8">
                <Routes>
                    {/* Ruta Principal: Tu galería estilo Pinterest */}
                    <Route path="/" element={<Galeria />} />
                    
                    {/* Ruta de Detalle: Aquí irá la info de cada miniatura */}
                    <Route path="/producto/:id" element={<div>Página de Detalle (Próximamente)</div>} />
                    
                    {/* Ruta 404: Si el usuario se pierde */}
                    <Route path="*" element={<div className="text-center py-20 text-2xl">404 - ¡Te has perdido en la Disformidad!</div>} />
                </Routes>
                </main>
            </div>
            </Router>
        );
        }

        export default App;

    ¿Qué hemos ganado con este cambio?
    Header Persistente: El título y el estilo siempre estarán ahí, cambies de página o no.

    Variable :id: Hemos preparado la ruta /producto/:id. Esto significa que si mañana entras en /producto/1, React sabrá que quieres ver el producto con ID 1.

    Protección contra errores: Si escribes cualquier tontería en la URL (ej: .../inventado), saltará tu mensaje personalizado de "Unidad eliminada".

- 2. Refactorización y creamos diferentes páginas
MOTIVO:
Ahora mismo tu App.tsx está "engordando" mucho porque tiene la lógica de los filtros, la lógica de la carga y el diseño del grid, todo metido dentro de una sola ruta. Los profesionales lo que hacen es "limpiar" el App.tsx moviendo ese contenido a archivos separados.

    0. Creamos una carpeta llamada pages dentro de src.
    1. Creamos la página/documento **Home.tsx**

    Movemos toda la lógica de los productos y el HTML de los filtros a ese archivo.
    Typescript
        import { useProductos } from '../hooks/useProductos';
        import { GridProductos } from '../components/GridProductos';
        import type { Categoria } from '../types/miniatures';

        export default function Home() {
        const { 
            productosFiltrados, 
            categoriaSeleccionada, 
            setCategoriaSeleccionada, 
            estaCargando 
        } = useProductos();

        const categorias: Categoria[] = ['Fantasía', 'Bustos', 'Monstruos', 'Tutorial Pintado'];

        return (
            <>
            {/* BARRA DE FILTROS */}
            <div className="flex flex-wrap gap-3 mt-8 mb-12">
                <button 
                onClick={() => setCategoriaSeleccionada(null)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!categoriaSeleccionada ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                Todos
                </button>
                {categorias.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setCategoriaSeleccionada(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${categoriaSeleccionada === cat ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    {cat}
                </button>
                ))}
            </div>

            {estaCargando ? (
                <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-bold animate-pulse">FORJANDO MINIATURAS...</p>
                </div>
            ) : (
                <GridProductos items={productosFiltrados} />
            )}
            </>
        );
        }

El nuevo App.tsx (Limpio y profesional)
Typescript
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

    // Páginas
    import Home from './pages/Home';
    import NotFound from './pages/NotFound';

    function App() {
    return (
        <Router>
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
            
            {/* HEADER ESTÁTICO */}
            <header className="max-w-7xl mx-auto mb-12">
            <h1 className="text-4xl font-black tracking-tighter text-white italic">
                HAMMER<span className="text-orange-500">FLOW</span> FORGE
            </h1>
            <p className="text-slate-400 mt-2 font-medium">
                El mercado definitivo para artistas de miniaturas y wargames.
            </p>
            </header>

            <main className="max-w-7xl mx-auto">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/producto/:id" element={<div className="text-white text-center py-20">Detalle del guerrero...</div>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            </main>

            <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} HammerFlow Forge - Panel de Control de Artista
            </footer>
        </div>
        </Router>
    );
    }

    export default App;

¿Qué hemos conseguido?
    Legibilidad: Cualquier programador que entre verá que hay 3 rutas claras en 5 segundos.
    Mantenimiento: Si mañana quieres cambiar el diseño de la galería, vas a Home.tsx. Si quieres cambiar el Header, vas a App.tsx. No se estorban.
    Escalabilidad: Estamos listos para que el Paso 10 (el diseño Pinterest) se haga solo en Home.tsx de forma aislada.


- 4. Página error 404
Creamos el archivo src/pages/NotFound.tsx
Typescript
    import { Link } from 'react-router-dom';

    export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-9xl font-black text-slate-800">404</h1>
        
        <div className="bg-orange-500 text-white px-4 py-1 rotate-3 -mt-8 mb-8 font-bold text-xl uppercase">
            ¡Unidad eliminada!
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">
            Te has adentrado demasiado en la Disformidad
        </h2>
        
        <p className="text-slate-400 max-w-md mb-8">
            La página que buscas no existe en este sector de la galaxia. 
            Puede que haya sido purgada por la Inquisición o que el enlace se haya roto.
        </p>

        <Link 
            to="/" 
            className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105"
        >
            Volver a la Forja (Inicio)
        </Link>
        </div>
    );
    }

    **Nota**
    ¿Por qué hemos usado <Link> en lugar de <a>?
    Si usas <a href="/">, el navegador refresca toda la página (pierdes el estado de React).
    Si usas <Link to="/">, React Router intercepta el clic y te lleva al inicio instantáneamente


    Y en el archivo App.tsx, sustituimos la línea de la pagina provisional error 404.
    TypeScript
        {/* RUTA 3: ERROR 404 (Captura cualquier ruta no definida) */}
                <Route path="*" element={<NotFound />} />


# Validación y Control de Calidad
Hacemos tres pruebas críticas para asegurar la integridad de la aplicación:

1. Test de Integridad de Módulos (Pantalla Blanca):
    Objetivo: Verificar que la conexión entre App.tsx y las nuevas rutas en /pages es correcta.

    Resultado: Éxito. La aplicación renderiza el contenido sin errores de importación/exportación. (En caso de error, la consola de desarrollador es el primer punto de diagnóstico).

2. Test de Persistencia de Lógica (Filtros Dinámicos):
    Objetivo: Confirmar que el Custom Hook useProductos funciona correctamente al haber sido trasladado a Home.tsx.

    Resultado: Éxito. El filtrado por categorías responde instantáneamente, validando que el estado de React se mantiene saludable en la nueva jerarquía.

3. Test de Navegación Manual (Rutas y 404):
    Objetivo: Comprobar que el "cerebro" de React Router intercepta las URLs correctamente.

    Pruebas realizadas:
    - Acceso a /producto/1: Se visualiza el componente de detalle provisional.
    - Acceso a /ruta-inexistente: Salta automáticamente la página 404 "Unidad Eliminada".
    - Botón de retorno: El componente <Link> devuelve al usuario a la Home sin recargar la página, confirmando que es una SPA (Single Page Application) real.