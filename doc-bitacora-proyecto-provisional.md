Paso 4: Preparar el proyecto
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

- 2. Instalación de paquetes Tailwind
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


Paso 5: Arquitectura (El código real)
Vamos a crear el "cerebro" de HammerFlow Forge. Definimos **cómo** es una figura, un proyecto y un tutorial.