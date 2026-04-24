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
Modificando "App.tsx" ir doc/hooks.md