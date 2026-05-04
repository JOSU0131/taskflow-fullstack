# Paso 14. Despliegue en Vercel

Vamos a convertir el proyecto en un "monorepo" funcional en Vercel. Actualmente, Vercel solo estaba leyendo la carpeta client (por eso el backend no respondía y los estilos fallaban. Bitacora: fallo Problemas de Post-Despliegue).  

Para que todo "viva" en el mismo sitio, necesitamos un archivo vercel.json en la raíz del proyecto (fuera de client y server) que actúe como "director de orquesta".

1. El archivo vercel.json (en Raíz del proyecto)
Creamos el archivo vercel.json en la carpeta principal.

Necesitaremos:

- Builds: ¿Cómo se cocina cada parte?
    Vercel por defecto solo busca una cosa, pero aquí le obligamos a construir dos:

    El Backend: Le decimos que el archivo server/index.js debe ejecutarse usando el motor de Node.js. Esto lo convierte en una Serverless Function (el servidor que responde a tus datos).  

    El Frontend: Le decimos que vaya a la carpeta client, lea el package.json y ejecute el comando de construcción (Vite). Le aclaramos que el resultado final estará en la carpeta dist

- Rewrites: ¿A dónde va cada clic?
    Esto es como un recepcionista que reparte el tráfico para evitar que nada se pierda:

    Tráfico de API: Cualquier petición que el navegador haga a una URL que empiece por /api/... será enviada directamente a tu carpeta /server/index.js. Por eso ya no necesitas el localhost:4000.  

    Tráfico Web: Cualquier otra cosa que pida el usuario (la página de inicio, el formulario, etc.) será dirigida a la carpeta de la web (/client/dist/).


- Código JSON en vercerl.json   
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/client/dist/$1"
    }
  ],
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ]
}
- - -

2. Ajustes Críticos
Debemos corregir:

- En el Frontend (client/src/api/miniatureService.ts):
    Debemos cambiar la URL base. Ya no será http://localhost:4000/api. Ahora debe ser simplemente /api. Al estar en el mismo dominio de Vercel, el navegador sabrá que debe buscar dentro de la propia web.

- En el Backend (server/index.js):
    Asegúramos que el "servidor" de Express termine con module.exports = app; en lugar de solo el app.listen. 
    **IMPORTANTE**: Vercel necesita exportar la aplicación para manejarla como una función sin servidor (Serverless Function)

- ¿Qué hemos cambiado y por qué?
        module.exports = app;: Esto es lo más importante. Vercel toma este objeto app y lo envuelve en su propia infraestructura para responder a las peticiones que lleguen a /api.  

        El condicional if: Evita que el servidor intente "escuchar" en un puerto manual cuando ya está subido a Vercel, lo cual a veces genera errores de logs innecesarios en la nube, pero te permite seguir trabajando en tu PC como siempre.

        Compatibilidad: Con este cambio, tu backend ahora es un "híbrido": funciona en tu ordenador con npm start y funciona en Vercel como una función moderna.

        En server/index.js
        El cambio de codigo Javascript:
            // ESTE ES EL CAMBIO CLAVE:
            // Solo ejecutamos app.listen si NO estamos en Vercel (entorno local)
            if (process.env.NODE_ENV !== 'production') {
                app.listen(PORT, () => {
                    console.log(`🚀 Servidor local en http://localhost:${PORT}`);
                });
            }

            // Exportamos la app para que Vercel la gestione
            module.exports = app;




- Ventajas: En resumen, los beneficios para tu proyecto son:
    Dominio Único: Todo vive bajo tu-web.vercel.app. Se acabaron los problemas de conexión entre diferentes direcciones.  

    Adiós a Localhost: El frontend ya no busca un servidor en tu ordenador, sino que busca "dentro de sí mismo" a través de la ruta /api.  

    Despliegue Atómico: Cuando haces un git push, Vercel actualiza tanto la base de datos/lógica (server) como el diseño (client) al mismo tiempo.

