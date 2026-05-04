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


- (editado) Código JSON en vercerl.json   
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/client/$1"
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


## **IMPORTANTE**
Los dos archivos vercel.json estabam peleando entre sí, el de la raiz del proyecto estaba mal configurado y "peleando" con el de la carpeta client.

Para que el Frontend (React) y el Backend (Node) convivan:

1. El cambio PRINCIPAL. En el Root Directory de Vercel
En el panel de Vercel (Settings > General), cambiaomos el Root Directory de client a la RAÍZ (./).

2. Borramos el vercel.json de la carpeta client

3. Editamos el vercel.json en la RAIZ del proyecto
Este archivo se encargará de dirigir el "tráfico": las llamadas a la API van al servidor, y el resto al cliente:
  JSON
    {
      "version": 2,
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "/server/index.js"
        },
        {
          "source": "/(.*)",
          "destination": "/client/$1"
        }
      ]
    }

Por qué: Como ahora el vercel.json de la raíz controla tanto el /server como el /client, Vercel necesita ver correctamente la estructura.

- ¿Qué estaba rompiendo el despliegue?
    Conflicto de "Rewrites": El archivo vercel.json de la raíz estabamos diciento que todo lo que no sea /api vaya a /client/dist/$1. Pero el de la carpeta client decia que todo vaya a /index.html. Vercel se mareaba y terminaba no encontrando el punto de entrada.  
    
    La ruta /client/dist/$1: era un error muy peligroso. Si tu Root Directory en el panel de Vercel sigue siendo client, Vercel ya está "parado" dentro de esa carpeta. Al decirle que busque en /client/dist, ¡está buscando en client/client/dist! No va a encontrar nada.
      
    Configuración de Build duplicada: 
    El package.json de cliente ya sabe que usa Vite. Al definir un "builds": [...] manual en la raíz con @vercel/static-build, estabamos anulando la detección automática de Vite y forzando un proceso que probablemente no coincida con lo que Vite espera. 

- Ventajas: En resumen, los beneficios para tu proyecto son:
    Dominio Único: Todo vive bajo tu-web.vercel.app. Se acabaron los problemas de conexión entre diferentes direcciones.  

    Adiós a Localhost: El frontend ya no busca un servidor en tu ordenador, sino que busca "dentro de sí mismo" a través de la ruta /api.  

    Despliegue Atómico: Cuando haces un git push, Vercel actualiza tanto la base de datos/lógica (server) como el diseño (client) al mismo tiempo.

