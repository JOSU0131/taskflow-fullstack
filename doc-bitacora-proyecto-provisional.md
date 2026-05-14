# Paso 4: Preparar el proyecto
Checklist de Revisión (Paso 4): Como ya "clone" el código del laboratorio anterior vamos a pasarle un "escáner" para confirmar que cumpla con los estándares de la fase 5 y del proyecto 

- **1. Estructura de Carpetas (Frontend)**
Asegúrate de que en tu carpeta src/ existan estos "cajones". Si no existen, créalos (aunque estén vacíos):
        src/api/: Para el cliente de red (fetch/axios).

        src/components/: Para botones, tablas, cards.

        src/context/: Para el estado global (ej. carrito o usuario).

        src/hooks/: Para tus propios hooks (ej. useHammerData).

        src/pages/: Para las vistas (Home, Detalle, etc.).

        src/types/: Importante. Mueve aquí tus interfaces de hammerflow.ts para que el proyecto esté ordenado.

        src/utils/: Para funciones de ayuda (como la de Luxon).

- **2. Instalación de paquetes Tailwind**
En carpeta client (abrimos terminal basheamos "cd client") e instalamos tailwind con:
    Bash 
    npm install -D tailwindcss postcss autoprefixer

    Generar los archivos de configuración.
    Ahora, ejecuta el siguiente comando para que aparezcan las carpetas tailwind.config.js y el postcss.config.js
    Bash
    npx tailwindcss init -p

    **NOTA**: tuve que crearlos manualmente, no encontré el porqué

    

    Configurar las rutas de rastreo.
    En tailwind.config.js en sección content le decimos a Tailwind qué archivos  debe vigilar para aplicar estilos:
    JavaScript
        /** @type {import('tailwindcss').Config} */
        export default {
        content: [
            "./index.html",
            "./src/**/*.{js,ts,jsx,tsx}",
        ],
        theme: {
            extend: {},
        },
        plugins: [],
        }
        - - -

    Probamos tailwind con comando (desde carpeta client, abrimos terminal y añadimos: cd client):
    Bash
    npm run dev

    Fix final.
    La configuración "clásica" necesitaba un paquete adicional para que Vite y PostCSS se entiendan
    Bash
    npm install -D @tailwindcss/postcss

    El motor de Tailwind se ha actualizado y ahora prefiere su propio plugin de PostCSS dedicado en lugar de usar el paquete genérico

- 3. Limpiar App.tsx
¿Por qué?
Eliminamos todo lo que era del proyecto anterio (alumnos, galería y tablas del proyecto). El nuevo App.tsx solo muestra la pantalla del logo **HammerFlow** con Tailwind funcionando.

- 4. Creamos las carpetas que faltan
Qué son y para qué sirven:

Carpeta	    Para qué
src/pages/	    Las "pantallas" de la app (Home, Detalle de figura, 404...)
src/hooks/	    Tus propios hooks reutilizables (ej. useHammerData)
src/types/	    Las interfaces TypeScript compartidas entre componentes
src/context/	El estado global (ej. carrito, usuario logado)
src/api/	    Las funciones que hablan con el servidor (fetch, axios)



# Paso 5: Arquitectura (El código real)
Vamos a crear el "cerebro/intelogencia" del negocio de HammerFlow Forge. Con estilo de (Frontend-only). 
Implementación de componentes que consumen la lógica de negocio.

Definimos como es una figura, un proyecto y un tutorial.

- 1. Define tus Modelos (Types)
    Creamos el archivo src/types/miniatures.ts. 
    Aquí es donde usamos las Uniones Discriminadas para diferenciar entre una figura en venta y un proyecto de mecenazgo.

        TypeScript:

        export type Categoria = 'Fantasía';

        interface BaseItem {
        id: string;
        titulo: string;
        autor: string;
        imagen: string;
        categoria: Categoria;
        }
        export interface ItemVenta extends BaseItem {
        tipo: 'VENTA';
        precio: number;
        stock: number;
        }
    
    NOTA: interface BaseItem (El molde común)
    Es el ADN básico. Aquí pones lo que tienen TODAS las miniaturas, sean para vender o para mecenazgo
    NOTA: export interface ItemVenta extends BaseItem (La especialización)

- 2. La Lógica de Negocio (Logic)
Creamos el archivo src/logic/hammerLogic.ts. Aquí usaremos Luxon (que deberías tener instalado) para calcular cuánto falta para que cierre un mecenazgo.

- 3. Mock Data (datos de prueba)
Crea src/data/mockData.ts para tener algo que mostrar en pantalla antes de conectar una API real.



# Paso 6: Desarrollo de componentes
Aquí vemos "cómo se ve la interfaz".

- 1. Creamos el "puente" Inteligente. Creación de la librería de componentes base

Creamos el archivo en src/components/MiniaturaCard.tsx:

Componente agnóstico: A la Card no le importa de dónde vienen los datos (si de un mock o de una API futura), solo sabe pintarlos.

Uso de la lógica: en el caso de MECENAZGO, estamos llamando a las funciones de hammerLogic.ts que creamos antes. El componente no sabe calcular porcentajes, se lo pide a la "lógica".

Tailwind Dinámico: Usamos style={{ width: ... }} para que la barra de progreso se mueva de verdad según los datos.      

- 2. Integración de Lógica: Usando las funciones que creamos en el paso anterior (calcularProgreso), uniendo la Arquitectura con la Vista

- 3. Con "Renderizado Condicional" ({condicion && ...}): Hacemos que React puede ocultar o mostrar partes de la interfaz basándose en los datos.

---

- 2. Transformación de App.tsx

Actualizamos App.tsx para que haga tres cosas:

    Importar tus datos de prueba (PRODUCTOS_MOCK).

    Importar el nuevo componente MiniaturaCard.

    Dibujar una cuadrícula (grid) con todos tus productos.

- 3. Ejemplo de crear componentes como listas, tarjetas, formularios o modales que **consuman datos tipados** (de la API o del estado global):

en archivo mochData.ts

se paso de:
    {
    id: '3',
        tipo: 'TUTORIAL',
        titulo: 'Tutorial de Pintura Avanzada',
        autor: 'Archaon_Paints',
        imagen: 'https://images.unsplash.com/photo-1558444479-2706fa58b8ec?q=80&w=300',
        categoria: 'Tutorial Pintado',
        duracion: '2 horas',
        precio: 20
    }

a
    {
        id: '3',
        tipo: 'TUTORIAL',
        titulo: 'Tutorial de Pintura Avanzada',
        autor: 'Archaon_Paints',
        imagen: 'https://images.unsplash.com/photo-1558444479-2706fa58b8ec?q=80&w=300',
        categoria: 'Tutorial Pintado',
        duracion: '2 horas',
        nivel: 'Intermedio',   // NOTA. FALTABA esta propiedad "nivel"
        precio: 20
    }


# Paso 7: Interactividad y Filtros
Modificando "App.tsx" ir docs/hooks.md

# Paso 8: Context y estado global
Ir a docs/context.md

# Paso 8.2: Recordatior despliegue Vercel

1. Instalación de Vercel CLI
Abre la terminal integrada en VS Code (puedes usar Ctrl + Ñ) y escribe:

Bash
    npm i -g vercel
    
    Nota: Si te da error de permisos en Mac/Linux, usa sudo npm i -g vercel.

2. Login y Vinculación
Una vez instalado, ejecuta estos comandos en orden:

vercel login: Te pedirá elegir un método (elige GitHub). Se abrirá una pestaña en tu navegador para confirmar.
vercel: Al escribir esto solo, empezará el asistente de vinculación:

A las preguntas: 
    Set up and deploy? yes

    Which scope? (Tu nombre de usuario)

    Link to existing project? yes (porque ya lo creaste en la web).

    What's the name of your existing project? Escribe el nombre que sale en tu repositorio github.
    
    Would you like to pull environment variables now? yes

Siguientes Pasos
    Despliegue final: Una vez termine, ejecuta el comando vercel --prod en tu terminal. Esto subirá tu código actual (con el nuevo Hook useProductos y la persistencia de localStorage) directamente a la URL de producción.

    Verifica el 404: Si tras el despliegue sigues viendo el error 404, recuerda crear el archivo vercel.json en la raíz de tu proyecto con el código de "rewrites"
        JSON
            {
            "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
            }

## Fallo en vercel
El error Command "npm run build" exited with 2 que viste anteriormente se debe exactamente a estos dos fallos de TypeScript. El compilador es estricto y, al detectar errores, detiene la generación de la carpeta dist, lo que impide que Vercel pueda desplegar nada.

1. Corregir src/components/GridProductos.tsx

    El error TS1484 ocurre porque tu configuración de TypeScript (verbatimModuleSyntax) exige que los tipos se importen explícitamente como tales.

    Cambia la línea 1 de: añadimos **type** 
    TypeScript
        import type { HammerItem } from '../types/miniatures';

2. Corregir src/logic/hammerLogic.ts
    El error TS6133 indica que estás importando HammerItem pero no lo estás usando en ninguna parte de ese archivo.

    Solución: * Borramos la línea  por completo si no vas a usar ese tipo en la lógica de ese archivo.
    linea 3 "import type { HammerItem } from '../types/miniatures';"

    MOTIVO: ¿Por qué se bloquea el despliegue?
    En entornos profesionales, se activa una regla llamada noUnusedLocals. Esta regla considera que tener código que no se usa es "basura" que ocupa memoria y confunde a otros programadores. Por eso, aunque el código funcione, TypeScript se niega a hacer el build hasta que lo limpies.

3. Conflicto de Identidad (Vínculos Fantasmas)
El proyecto intentaba conectarse a una instancia antigua de Vercel (taskflow4). 

    - Cual era el problema o Síntoma?: Al intentar desplegar o abrir la web, aparecía un error 404 NOT FOUND o la pestaña del navegador mostraba el nombre de un proyecto antiguo (taskflow4-react) en lugar del actual.

    - La Causa Raíz: Existía una carpeta oculta llamada .vercel tanto en la raíz como en /client. Estos archivos contenían IDs antiguos que "obligaban" a tu ordenador a conectarse al proyecto equivocado de la nube.

    - Adicionalmente había un Conflicto de Nombres: El archivo package.json seguía identificado como taskflow4-react, lo que confundía a Vercel al intentar vincularlo con el nuevo repositorio de GitHub.

Pasos para la Solución ("Operación Limpieza")
    1. Poda de Archivos Ocultos: Borramos todas las carpetas .vercel existentes para romper cualquier vínculo previo con el servidor.

    2. Actualización de Identidad: Editamos el package.json para darle un nombre nuevo y único al proyecto (hammerflow-forge).

    3. Configuración del Directorio Raíz (Root): En el panel de Vercel, especificamos que el código real vive en la subcarpeta /client. Esto permitió que Vercel supiera exactamente dónde buscar el archivo de entrada.
            Se cambio el Root Directory en la web de vercel (https://vercel.com/josus-projects-e490e732/taskflow-fullstack/settings/build-and-deployment) en Settings / build and deployment

    4. Vinculación Limpia: Ejecutamos el comando vercel desde la raíz, negándonos a usar proyectos existentes y creando uno nuevo desde cero.

    5. Integración con GitHub: Aceptamos la conexión directa con el repositorio. Esto activó el CI/CD (Despliegue Continuo), lo que significa que a partir de ahora, GitHub y Vercel "hablan" el mismo idioma automáticamente.

# Paso 9. Rutas y navegación
Ir a docs/routing.md

# Paso 10. Formularios e Interacción.
Aquí es donde la web deja de ser una "galería para mirar" y se convierte en una "herramienta para trabajar". 

En nuestro lab/proyecto **HammerFlow Forge**, esto consistirá en:
    1. Un formulario para subir nuevas miniaturas (Nombre, precio, categoría, URL de imagen).
    2. Un formulario de contacto o reserva para los artistas.
    3. Validación y Control

# Paso Extra. Estética 
Dado que el proyecto había heredado una estética "plana" al clonar/hacer pull del proyecto anterior en github. Ese proyecto habia sido inicializado usando el comando de **Vite** para crear un entorno de React con TypeScript.


Como estamos usando Tailwind CSS, podemos hacer cambios sin tocar un solo archivo .css, solo añadiendo palabras clave a las etiquetas.

1. Control de Tamaño Máximo (El Contenedor)
Para que la web no se estire infinitamente en monitores gigantes y las imágenes no se vuelvan gigantescas, lo ideal es "encapsular" todo el contenido en un contenedor central.

En el componente principal (App.tsx ) y en el contenedor principal, vamos a modificar max-w-6xl (que limita el ancho) y el mx-auto (que lo centra):

((**Recomendación por ia**: Para lograr ese "encapsulamiento" perfecto y unificar el control del tamaño, vamos a mover esas reglas a un contenedor padre único.

Sigue estos pasos en tu archivo:
    1. Modifica el Div de Fondo
    2. Crea el Contenedor Maestro (El "Wrapper")
    3. Limpia las clases de tus etiquetas actuales
))

¿Qué has ganado con esto?
    Consistencia: Si mañana quieres que la web sea un poco más ancha, solo cambias max-w-6xl en un solo sitio en lugar de tres.  

    Seguridad Visual: Al usar px-6 en el contenedor padre, te aseguras de que en teléfonos móviles el contenido nunca choque contra los bordes físicos de la pantalla.

    Orden de Prioridad: Ahora, el CSS de Tailwind sabe exactamente que hay un marco de trabajo (el wrapper) y todo lo que está dentro se ajusta a él.
    
2. Limpieza de archivos archivos 
Limpiamos:
    - Archivos de configuración antiguos de Tailwind v3 ((en una instalación de v4 es posible que sea lo que está rompiendo los "estilos" en VerceL)).
        Dentro de la carpeta client:
        Borramos:  tailwind.config.js, postcss.config.js

    - Re-Configuramos index.css
            Borramos:
            @tailwind base;
            @tailwind components;
            @tailwind utilities;
        Por
            CSS
            @import "tailwindcss";

**NOTA IMPORTANTE**: ¿Por qué se veía "blanco" la web? 
Al tener instalada la versión 4 de Tailwind pero usando las directivas de la versión 3 (o viceversa), el compilador fallaba silenciosamente y generaba un archivo CSS vacío. 
Vercel lo intenta desplegar, pero sin estilos.

3. Resolución de Errores de Compilación
¿Dónde estaba el fallo "gordo"?
El despliegue en Vercel fallaba no solo por los estilos, sino por un bloqueo del compilador de TypeScript (tsc). 
En un entorno profesional, si TypeScript detecta que intentas enviar datos que no coinciden con tus interfaces, detiene la construcción por seguridad.

Hubo 3 Desajustes:
    1. Nombre del Método: Se estaba llamando a miniatureService.createMiniature() cuando el método real en el servicio es simplemente create().  
    2. Propiedad "Título" vs "Nombre": Según el archivo miniatures_2.ts, la interfaz BaseItem utiliza la propiedad titulo. Intentar usar nombre o name disparaba el error TS2353.  
    3. Campos Obligatorios: La interfaz BaseItem exige campos que no se estaban enviando desde el formulario, como autor, imagen y tipo. 

Solucion:
    1. Se implementó un "mapeo" de datos en NuevoProducto_4.tsx para traducir el estado del formulario al lenguaje que entiende el Backend y TypeScript:  De nombre (UI) → a titulo (Data).  Asignación de tipos: 2. Se forzó el campo tipo como 'VENTA' para satisfacer la Unión Discriminada de HammerItem.  
    3. Casteo de tipos: Se usó as any o as Categoria para evitar que TypeScript bloquee el envío mientras se termina de definir la lógica de los nuevos productos (Tutoriales/Bustos).

## RESUMEN TÉCNICO
La web se veía blanca en Vercel porque:

    Tailwind v4 ignoraba las directivas de la v3, generando un CSS de 0 bytes.

    TypeScript abortaba el proceso de build al encontrar errores de nombre en las propiedades de los objetos (titulo vs nombre).

    Vercel, al no poder completar el comando npm run build, no actualizaba los archivos en el servidor.

Estado Final: Una vez unificado el lenguaje (todo a titulo) y limpiado los archivos de configuración de Tailwind v3, el compilador da "luz verde" y los estilos de la v4 se inyectan correctamente.


# Nuevo error. Problemas de Post-Despliegue
**NOTA**: ir a /docs/deployment

    Fallo de Conexión (CORS/URL): La aplicación frontend en producción intenta consumir una API en localhost:4000. Se identifica que es necesario configurar una variable de entorno (VITE_API_URL) para que en producción apunte al servidor desplegado y no al local.

    Sincronización de Repositorio: Se confirma que GitHub y Vercel están sincronizados (35 commits en total). Los cambios en la carpeta client se despliegan de forma independiente a la carpeta server.

# Paso 11. Backend - Auditoría y arreglo del POST
Ir a /docs/api.md para el detalle. Resumen rápido aquí:

- 1. Bug detectado en server/controllers/miniatureController.js
    El controller validaba **`nombre`** y **`precio`** del body, pero el frontend desde el inicio enviaba **`titulo`** (alineado a la interfaz `BaseItem`). Resultado: cualquier POST devolvía 400 "Nombre y precio son obligatorios" en silencio. El bug estaba "tapado" porque en NuevoProducto.tsx había un `as any` que evitaba el error de TypeScript en build, pero la petición real al servidor nunca creaba nada.

    **NOTA**: el frontend mostraba el toast verde de "✅ Unidad forjada" porque la validación cliente pasaba. Pero al recargar la galería, la pieza no aparecía porque el backend la había rechazado.

- 2. Refactor del controller
    Implementé una función `validarMiniatura(data)` que valida según el campo `tipo` (Unión Discriminada):
        - VENTA → exige `precio` > 0 y `stock` >= 0
        - MECENAZGO → exige `meta` > 0, `recaudado` >= 0, `fechaFin` válida
        - TUTORIAL → exige `precio` > 0, `duracion` y `nivel` ('Básico'|'Intermedio'|'Avanzado')

    Mensaje de error específico para cada caso, devuelto como `{ message: "..." }` con código 400.

- 3. Endpoint nuevo: GET /api/miniatures/:id
    Antes solo había `getAll`. Hacía falta este para la página de detalle.
    Devuelve 404 si no existe el id.

- 4. PUT/DELETE
    Estaban definidos en routes pero sin uso real. Ahora también pasan por la misma `validarMiniatura` cuando hace falta.



# Paso 11.2. Documentación de la API con Swagger (Bonus)
Bonus del enunciado: documentación de la API con Swagger/OpenAPI.

- 1. Instalación
    Bash (en carpeta /server):
        npm install swagger-ui-express swagger-jsdoc

    NOTA: swagger-ui-express expone una interfaz web para "probar" la API,
    swagger-jsdoc genera el JSON OpenAPI a partir de los comentarios JSDoc de las routes.

- 2. Archivo server/swagger.js
    Define el "esquema" de la API: schemas de BaseItem, ItemVenta, ItemMecenazgo, ItemTutorial y la unión `HammerItem` con `oneOf`.

- 3. Anotaciones en server/routes/miniatures.js
    Añadidos comentarios JSDoc con `@openapi` que describen cada endpoint.

- 4. Montaje en server/index.js
    JavaScript:
        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

- 5. Acceso
    En desarrollo: http://localhost:4000/api/docs
    En producción (Vercel): /api/docs



# Paso 12. Capa de red en el frontend (mejora del cliente)

- 1. Nuevo archivo src/types/api.ts
    Antes los errores se "perdían" como strings. Creé:
        - `ApiErrorBody` (lo que devuelve el server: `{ message: string }`)
        - clase `ApiError extends Error` con `.status` (código HTTP) y `.body`

    NOTA: extender `Error` permite usar `if (err instanceof ApiError)` en cualquier
    componente para distinguir entre "el server me dio 404" y "no hay red".

- 2. Refactor de src/api/miniatureService.ts
    - Añadidos: `getById(id)`, `update(id, partial)`, `delete(id)`
    - Helper `processResponse<T>(response)` que centraliza el manejo de errores:
      si `response.ok` devuelve el JSON tipado, si no, lanza `ApiError`.
    - URL configurable con `import.meta.env.VITE_API_URL` para que en producción
      apunte al server desplegado y no a localhost (el bug que tuvimos en Vercel).

- 3. Helper `HammerItemSinId` en types/miniatures.ts
    PROBLEMA: `Omit<HammerItem, 'id'>` rompía la unión discriminada. TypeScript veía:
        Omit<{tipo:'VENTA',...} | {tipo:'MECENAZGO',...} | {tipo:'TUTORIAL',...}, 'id'>
    y "colapsaba" la unión, perdiendo la relación entre `tipo` y los campos específicos.
    Resultado: errores TS2353 al hacer `{ tipo: 'VENTA', precio: 50, stock: 1 }`.

    SOLUCIÓN: Conditional type DISTRIBUTIVO:
    TypeScript:
        export type HammerItemSinId = HammerItem extends infer T
          ? T extends HammerItem
            ? Omit<T, 'id'>
            : never
          : never;

    Esto fuerza a TS a aplicar `Omit` a cada miembro de la unión por separado.

    NOTA: este patrón es común en TS cuando se tienen uniones discriminadas y se
    necesita "transformar" cada variante. Lo googlee como "distributive conditional types".



# Paso 12.2. Mejoras del Custom Hook useProductos

- 1. Búsqueda con debounce
    Añadido un nuevo state `busqueda` que se filtra por título o autor. Para no
    filtrar en cada tecla, paso el valor por un nuevo hook `useDebounce`.

    NOTA: el filtrado combinado (categoría + búsqueda) se hace en un único
    `useMemo` para no rerenderizar de más.

- 2. Persistencia de la categoría seleccionada
    Sigue como estaba: localStorage. Esto NO es "datos de negocio", es preferencia
    de UI, así que es correcto que viva en el navegador (no contradice el paso 12).



# Paso 12.3. Nuevos hooks (Bonus: segundo custom hook)

- 1. useDebounce<T>(valor: T, delayMs?: number): T
    Hook genérico que retrasa la actualización de un valor. Lo usa el buscador
    para no filtrar en cada tecla pulsada.

    Implementación: `useEffect` con `setTimeout` y cleanup que cancela el timeout
    anterior si el valor cambia antes de que expire.

- 2. useFavoritos()
    Gestiona ids de favoritos con persistencia en localStorage:
        - `favoritos: string[]` (los ids)
        - `esFavorito(id): boolean`
        - `toggleFavorito(id)`
        - `limpiarFavoritos()`

    NOTA importante: solo los IDS viven en localStorage. Los datos completos
    siguen siendo "fuente de verdad" del backend. Si una mini se borra del server,
    el id favorito simplemente no encuentra match y desaparece de la página de
    Favoritos. Esto evita tener datos desincronizados entre cliente y server.



# Paso 8. (Por fin) Context API: FavoritosContext

Implementación pendiente del paso 8. Lo encajé ahora porque tiene sentido junto
con el sistema de favoritos.

- 1. src/context/FavoritosContext.tsx
    Context que expone los favoritos a TODA la app. Lo necesitan:
        - La MiniaturaCard (para pintar el corazón rellenado o vacío)
        - El Navbar (para el contador de favoritos)
        - La página /favoritos (para listar)

    Sin Context, habría que pasar `favoritos`, `toggleFavorito`, etc. por props
    desde App.tsx hasta cada nieto. Eso es prop drilling y se vuelve infumable.

- 2. Patrón usado
    TypeScript:
        const FavoritosContext = createContext<Value | null>(null);
        export const FavoritosProvider = ({ children }) => {
            const value = useFavoritos();
            return <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>;
        };
        export const useFavoritosContext = () => {
            const ctx = useContext(FavoritosContext);
            if (!ctx) throw new Error('Debe usarse dentro de <FavoritosProvider>');
            return ctx;
        };

    NOTA: el `null` inicial + el throw del hook hacen que si por error consumes
    el contexto fuera del Provider, el error es inmediato y claro en consola
    en lugar de un `cannot read property of null` críptico.

- 3. Montaje
    Envolví toda la app en `<FavoritosProvider>` dentro de `App.tsx`, fuera del
    Router para que el state sobreviva a cambios de ruta.



# Paso Detalle. Ruta /producto/:id (la que estaba vacía)

- 1. Nueva página src/pages/DetalleProducto.tsx
    Antes la ruta `/producto/:id` solo mostraba "Cargando datos del guerrero..."
    sin componente real. Ahora:
        - Lee el `id` con `useParams`
        - Llama a `miniatureService.getById(id)` en useEffect
        - Maneja los 3 estados de red (cargando, error, datos)
        - Si el backend devuelve 404 (instanceof ApiError && status===404),
          muestra mensaje específico
        - Renderiza un layout grande de 2 columnas con imagen + datos
        - Bloque CTA distinto por TIPO (botón naranja para VENTA, blanco para
          MECENAZGO, azul para TUTORIAL)
        - FavoritoButton arriba a la derecha de la imagen

- 2. Link desde MiniaturaCard
    La card entera ahora es un `<Link to={'/producto/'+item.id}>`.
    El botón de favorito hace `e.preventDefault()` + `e.stopPropagation()`
    para que pulsar el corazón NO navegue.



# Paso 10.2. Refactor de NuevoProducto (3 tipos de verdad)

Antes el formulario fingía soportar tipos pero forzaba `tipo: 'VENTA'` con un
`as any`. Ahora:

- 1. Selector de tipo
    3 botones grandes arriba: VENTA / MECENAZGO / TUTORIAL.

- 2. Campos dinámicos
    Bajo el bloque común (título/autor/imagen/categoría) aparecen los campos
    específicos según el tipo:
        - VENTA → precio, stock
        - MECENAZGO → meta, recaudado, fechaFin (input type="date")
        - TUTORIAL → precio, duración, nivel

- 3. Construcción tipada del item
    Función `construirItem(): HammerItemSinId | null` que valida y devuelve un
    objeto que cumple la unión discriminada SIN `as any`.

- 4. UX de éxito
    Antes mostraba toast verde y limpiaba campos. Ahora redirige a
    `/producto/{id-creado}` con `useNavigate()`. Más natural.



# Paso Estética 2. Mejoras visuales y UX

- 1. Hero (src/components/Hero.tsx)
    Sección de bienvenida con gradiente, glows difuminados (`blur-3xl`) y CTAs
    grandes. Solo en la home.

- 2. Navbar (src/components/Navbar.tsx)
    Barra superior sticky con backdrop-blur. Logo, links a Galería / Favoritos /
    Forjar. Contador rojo encima del link de Favoritos cuando hay alguno.
    Usa `<NavLink>` de React Router para resaltar el link activo en naranja.

- 3. SkeletonCard (src/components/SkeletonCard.tsx)
    Reemplaza el spinner-único por una rejilla de "huesos" animados que
    imitan la estructura de las cards reales. Mejor UX percibido.

- 4. Buscador (src/components/Buscador.tsx)
    Input con icono de lupa SVG. Coherente con la paleta dark + naranja.

- 5. MiniaturaCard mejorada
    - Hover: `translate-y` ligero, borde naranja y `scale-105` en la imagen
    - Badge superior con color por tipo (naranja VENTA, púrpura MECENAZGO, azul TUTORIAL)
    - FavoritoButton flotante
    - Gradiente oscuro abajo para legibilidad
    - `loading="lazy"` en las imágenes (mejora First Paint)

- 6. Estado vacío en Home
    Cuando los filtros no devuelven nada, muestro una card punteada con
    "🔍 Ningún resultado coincide" en vez de un grid vacío.



# Paso 4.2. Refactor de App.tsx + Lazy Loading (Bonus: React.lazy)

Antes App.tsx tenía toda la lógica de la home dentro (filtros, grid, gestión
de errores) y además había un Home.tsx duplicado que no se usaba.

- 1. Limpieza
    App.tsx ahora es solo: providers + layout + routing. Cada página vive en
    su propio archivo y se importa.

- 2. Lazy loading con React.lazy
    TypeScript:
        const Home = lazy(() => import('./pages/Home'));
        const DetalleProducto = lazy(() => import('./pages/DetalleProducto'));
        const NuevoProducto = lazy(() => import('./pages/NuevoProducto'));
        const Favoritos = lazy(() => import('./pages/Favoritos'));
        const NotFound = lazy(() => import('./pages/NotFound'));

    Y envuelto en `<Suspense fallback={<RouteFallback />}>` con un spinner
    pequeño.

    NOTA: ¿qué gano? Vite genera un chunk JS por cada página. El navegador solo
    descarga el chunk de la página actual. La galería se ve antes porque el
    navegador no tiene que parsear el código de NuevoProducto, DetalleProducto
    ni Favoritos. Comprobado en `npm run build`:
        Home-CDwsagYe.js                6.13 kB │ gzip:  2.35 kB
        DetalleProducto-D8XoSRuG.js     5.72 kB │ gzip:  1.86 kB
        NuevoProducto-BiE--EJT.js       6.65 kB │ gzip:  2.05 kB
        Favoritos-4mUbSLVA.js           2.32 kB │ gzip:  1.06 kB
        NotFound-g5KiYIY3.js            0.97 kB │ gzip:  0.54 kB



# Paso 13. Testing (estuctura nueva: testing manual + tests automáticos)

Detalle completo en /docs/testing.md. Resumen:

- 1. Pruebas manuales realizadas
    - GET de la galería (3 mocks de seed iniciales)
    - GET por id (200 y 404)
    - POST de los 3 tipos (todos con validación)
    - PUT y DELETE
    - Filtros de categoría
    - Búsqueda con debounce (no filtra en cada tecla)
    - Favoritos (toggle, persistencia, contador, limpiar)
    - Detalle de producto con id existente y con id inventado (404)
    - Responsive: 375px (móvil), 768px (tablet), 1280px (desktop)

- 2. Tests automáticos (Bonus)
    Configuré Vitest + React Testing Library:
        - vitest.config.ts SEPARADO de vite.config.ts (ver NOTA abajo)
        - src/test/setup.ts con jest-dom matchers y cleanup global
        - 10 tests pasando en 3 archivos:
            * useFavoritos (4 tests)
            * calcularProgreso (3 tests)
            * MiniaturaCard (3 tests, con MemoryRouter + FavoritosProvider)

    NOTA — POR QUÉ DOS CONFIGS:
    Si meto el bloque `test: {...}` dentro de vite.config.ts, el comando
    `tsc -b` (que se ejecuta antes del `vite build`) lee tsconfig.node.json
    y NO incluye los tipos de Vitest. Resultado: error TS2769 al hacer build.
    Hay 2 soluciones: (a) añadir "vitest" a `types` de tsconfig.node.json, o
    (b) separar configs. Elegí (b) porque mantiene el build de producción
    libre de dependencias de testing. vitest.config.ts importa Vitest, vite.config.ts no.

    Comando:
    Bash:
        npm run test:run

- 3. Bugs detectados y arreglados
    Lista detallada en /docs/testing.md. Los 5 grandes:
        1. Backend validaba `nombre` cuando frontend envía `titulo`
        2. App.tsx duplicaba lógica con pages/Home.tsx (Home no se usaba)
        3. Ruta /producto/:id estaba vacía
        4. Formulario solo creaba VENTA aunque el modelo soportaba 3 tipos
        5. Omit<HammerItem, 'id'> rompía la unión discriminada



# Paso 15. Retrospectiva (mejorada)

Fui a /docs/retrospective.md y lo amplié. Cubre:
    - Aprendizajes principales (frontend, backend, capa de red, testing, deploy)
    - Decisiones arquitectónicas y por qué
    - Errores que cometí y cómo los resolví
    - Cómo usé IA durante el desarrollo (puntos donde ayudó, cuándo me equivoqué siguiéndola, qué aprendí del proceso)
    - Qué me llevo para el próximo proyecto

# Paso 16. Mejora Estetica - Manual

- 1. Qué hemos hecho?: 
    Borramos el degradado (bg-gradient...), añadimos el style para cargar la imagen y le dimos más altura (min-h-[550px]) para que se vea el paisaje.

    En codigo: quitamos //className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient...//.
    E introducimos fondo de pantalla paisaje "hero-hammerflow.jpg"

- 2. ¿Qué hemos hecho?: 
    Quitamos las luces de colores y ponemos una capa negra suave encima de toda la imagen para que las letras blancas se lean bien sobre el cielo naranja.

- 3. ¿Qué hemos hecho?:

    - Inmersión Total: Eliminamos los bordes y redondeados del Hero.tsx para que la imagen épica ocupe todo el ancho y casi todo el alto de la pantalla (min-h-[85vh]), creando una verdadera "carta de presentación".

    - Identidad de Marca: Implementamos el título "Hammerflow Forge" con estilo wargame interactivo (amarillo con perfilado negro) que se queda en la cabecera de la experiencia visual.

    - Transición de Estilo: Preparamos la estructura para que el "fondo épico" sea solo el inicio, permitiendo que al hacer scroll la web pase a secciones de contenido (Galería, Tutoriales, etc.) sobre fondos más limpios o neutros.

    - Header "Flotante": Ajustamos la lógica para que el menú de navegación sea independiente del fondo del Hero, permitiendo que pueda quedarse fijo en la parte superior (sticky) mientras el usuario navega.

    - Evolución de Home: Pasamos de una web que era "solo una galería" (estilo Second Hammer) a una Home estructurada que presenta el ecosistema completo: piezas únicas, mecenazgos y formación.

Añadimos (versión 3):

    ¿Qué hemos hecho?:

    - Rediseño de Navegación: Se transformó el Header en un elemento flotante y centrado (estilo Highlands), eliminando la alineación lateral anterior.

    - Expansión Visual: Se liberó el componente Hero de sus márgenes y bordes redondeados, logrando que la imagen de fondo cubra el 100% del ancho de la pantalla.

    - Restauración de Identidad: Se recuperó el estilo de logo "Games Workshop" con texto amarillo perfilado en negro y sombras profundas para el título principal.

    - Composición de Landing: Se reorganizaron los elementos (título, descripción y botones) para estar completamente centrados, mejorando la jerarquía visual de la página de inicio.



# Resumen final del estado

Estructura final del cliente:
    src/
      api/        miniatureService.ts (con ApiError tipado)
      components/ MiniaturaCard, GridProductos, FavoritoButton, Hero, Navbar, Buscador, SkeletonCard
      context/    FavoritosContext.tsx
      hooks/      useProductos, useFavoritos (Bonus), useDebounce (Bonus)
      logic/      hammerLogic.ts (con tests)
      pages/      Home, DetalleProducto (NUEVO), NuevoProducto (refactor 3 tipos), Favoritos (NUEVO), NotFound
      types/      miniatures.ts (con HammerItemSinId), api.ts (NUEVO)
      test/       setup.ts

Estructura final del server:
    server/
      controllers/miniatureController.js (validación por tipo)
      routes/     miniatures.js (con anotaciones OpenAPI)
      swagger.js  (NUEVO)
      index.js    (con /api/docs montado)

Comandos importantes:
    Bash:
        # Frontend
        cd client && npm install && npm run dev      # http://localhost:5173
        cd client && npm run test:run                # Ejecuta todos los tests
        cd client && npm run build                   # Build de producción

        # Backend
        cd server && npm install && npm start        # http://localhost:4000
                                                     # /api/docs  ← Swagger UI


# Paso 16. Auditoría final (post-build)

Después de tenerlo todo funcionando, pasé el linter y revisé el código una
vez más con ojo crítico para pillar lo que se me había escapado.

- 1. Errores reales del linter
    a) FavoritosContext.tsx exportaba el Provider Y el hook desde el mismo
       archivo. Esto rompe Fast Refresh de Vite (`react-refresh/only-export-components`).
       Lo separé en 3 archivos: `favoritosContext.ts` (solo createContext +
       tipo), `FavoritosProvider.tsx` (solo el componente), `useFavoritosContext.ts`
       (solo el hook).

    b) En DetalleProducto tenía `setError(...)` y `setEstaCargando(false)`
       síncronamente DENTRO del body de un `useEffect`. ESLint avisa
       (`react-hooks/set-state-in-effect`) porque puede causar renders en cascada.
       Lo arreglé moviendo la validación DENTRO de la función `obtener` async,
       que ya está fuera del body síncrono.

- 2. Mejoras menores que añadí
    - `.env.example` para documentar la variable `VITE_API_URL` (la `.env.local`
      no se sube a git, así que cualquiera que clone el repo no sabe qué hace falta).
    - `try/catch` en el `setItem` de `useFavoritos`: en modo privado/incógnito
      `localStorage.setItem` puede lanzar (cuota=0). Mejor que la app no
      persista a que casque entera.
    - Formato de precio con `toLocaleString('es-ES')` en MiniaturaCard y
      DetalleProducto. Para enteros pequeños no cambia nada (`50€`), pero para
      decimales respeta la coma (`25,99€`) y para miles añade separador
      (`1.500€`).

- 3. Cosas que detecté pero NO toqué (con motivo):
    - `<button>` dentro de `<Link>` en MiniaturaCard: técnicamente nested
      interactive elements. Funciona y es el patrón que usan Wallapop, Spotify,
      Vinted. La alternativa (div clicable con role="link") es peor.
    - Tests más profundos para DetalleProducto y useProductos: requieren
      mockear fetch (con vi.mock o MSW). Es una mejora real pero significativa,
      pendiente para una siguiente iteración.

- 4. Verificación final
    Bash:
        npm run lint        # SIN errores ni warnings
        npm run build       # SIN errores
        npm run test:run    # 10/10 tests pasando

