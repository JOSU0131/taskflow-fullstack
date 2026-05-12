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

## Paso 8.2: Recordatoeio despliegue Vercel

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

# Paso Extra. Fallo en Estética 
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



# Paso 15: Rediseño visual en rama separada".

Paso extra. Mejora UI/UX y Refactorización con IA Claude

