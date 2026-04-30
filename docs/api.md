# Paso 11. Backend y API
El backend es el cerebro central (servidor) donde se guardan los datos para que sean accesibles desde cualquier parte del mundo por cualquier usuario, en cualquier navegador

En resumen ahora nos toca darle una "memoria" permanente y segura que no dependa solo del navegador propio.

    Tenemos 3 objetivos:
        1. La Persistencia Real (Adiós al LocalStorage)
        Hasta ahora, si guardabamos un producto "Dragón Rojo" en el LocalStorage y se abría la web desde otro ordenador, ya no se vería nada.

        2. Integración de Sistemas (Fase Full-Stack)
        Necesitaremos:
            Un Frontend (React): La cara bonita que el usuario toca.  

            El Backend (Node/Express): El motor que procesa la lógica, valida que los datos sean correctos y se comunica con la base de datos.  

            Y un API: El puente o "túnel" que permite que ambos hablen.

        3. Seguridad y Validación "en la frontera"
        Ademas nos piden validación "en la frontera de red". El El backend será una segunda línea de defensa


## 1. Estructura del Backend

- 1. Creamos una carpeta llamada server en la raíz del proyecto (al mismo nivel que client o src). 

    MI-PROYECTO/
        server/
        ├── data/           # (Opcional) Archivo JSON para simular base de datos
        ├── controllers/    # Lógica de qué hacer con los datos (el "cerebro")
        ├── routes/         # Definición de los endpoints (las "puertas")
        ├── middleware/     # Validaciones y seguridad
        └── index.js        # Punto de entrada del servidor Express


- 2. Creamos el Punto de Entrada (server/index.js)
    Este archivo arranca el servidor y conecta las piezas. Es el equivalente al main.tsx pero en el backend
    
        - Creamos la carpeta "server"
        - Inicializar el servidor. Estando en la terminal dentro de server ("cd server"), escribimos:
            Bash
            npm init -y
        ¿Qué hace esto? Crea un archivo package.json exclusivo para el servidor. Es vital porque el servidor necesita sus propias herramientas (como Express), que son distintas a las de React.  

        - Instalamos las "herramientas de forja". Instalamos los dos paquetes básicos:
            Bash
            npm install express cors
        ¿Qué hace esto?
            express: El marco de trabajo para crear las rutas y el servidor.
            cors: Es el "pasaporte". Sin esto, el navegador bloqueará a React cuando intente pedirle datos al servidor por seguridad

        - Creaamos el archivo index.js. El verdadero "Punto de Entrada". Creamos el archivo "index.js" dentro de la carpeta server

        - Validación
        El momento de la verdad (Encendido). Al terminar la estructura de carpetas y código.
            Bash
            node index.js

- 3. Las Rutas (server/routes/miniatures.js)
Aquí definimos el "contrato" de la API. Solo decimos qué URLs existen y qué método usan.

    Javascript
        const express = require('express');
        const router = express.Router();
        const miniatureController = require('../controllers/miniatureController');

        // Definición de Endpoints (REST)
        router.get('/', miniatureController.getAll);         // Obtener todas
        router.post('/', miniatureController.create);        // Crear (el Dragón Rojo)
        router.delete('/:id', miniatureController.delete);   // Eliminar

        module.exports = router;

- 4. El Controlador (server/controllers/miniatureController.js)
Aquí es donde ocurre la magia. Es donde validamos los datos "en la frontera de red".

    Javascript
        // Simulación de base de datos en memoria (luego puedemos usar un JSON)
        let miniatures = [
            { id: '1', nombre: 'Guerrero Orco', precio: 15, categoria: 'Fantasía', descripcion: 'Un fiero guerrero.' }
        ];

        const miniatureController = {
            getAll: (req, res) => {
                res.status(200).json(miniatures); // Código 200: Éxito
            },

            create: (req, res) => {
                const { nombre, precio, categoria, descripcion } = req.body;

                // VALIDACIÓN EN LA FRONTERA (Paso 11)
                if (!nombre || precio <= 0) {
                    return res.status(400).json({ message: 'Datos inválidos: nombre requerido y precio > 0' });
                }

                const nuevaMini = {
                    id: Date.now().toString(),
                    nombre,
                    precio,
                    categoria,
                    descripcion
                };

                miniatures.push(nuevaMini);
                res.status(201).json(nuevaMini); // Código 201: Creado con éxito
            },

            delete: (req, res) => {
                const { id } = req.params;
                const existe = miniatures.find(m => m.id === id);

                if (!existe) {
                    return res.status(404).json({ message: 'Miniatura no encontrada en la forja' });
                }

                miniatures = miniatures.filter(m => m.id !== id);
                res.status(200).json({ message: 'Pieza eliminada correctamente' });
            }
        };

        module.exports = miniatureController;

- - -

- 5. Resumen:
    Separación de responsabilidades: Si mañana queremos cambiar cómo se guardan los datos, solo tocas el controlador, no las rutas ni el servidor principal.  

    Códigos HTTP: Estamos usando 200, 201, 400 y 404. Esto es lo que pide el Paso 11 para que la API sea estándar. 

    Arquitectura por capas: Rutas → Controladores → Datos.

- 6. Validación
Ahora que los archivos ya existen en sus carpetas correspondientes, vuelve a la terminal y ejecuta:
        Bash
        node index.js

    ¿Qué debería pasar?
    Si todo está en su sitio, el error MODULE_NOT_FOUND desaparecerá y verás el mensaje de éxito:
    Servidor de la Forja rugiendo en http://localhost:4000



## 2. Creamos el "tunel" 
El siguiente paso es conectar el Frontend con el Backend.  

Actualmente, cuando rellenamos el formulario en la web, los datos se quedan "flotando" en el navegador. Vamos a hacer que viajen por el "túnel" (API) hasta el nuevo servidor

- 1. Cliente de API en el **Frontend**

    **NOTA IMPORTANTE**
    **En la carpeta client/src**, creamos una nueva carpeta llamada api y dentro un archivo llamado miniatureService.ts. 
    
    Esto servirá para centralizar todas las peticiones.

            TypeScript
            

- 2. Conectar el Formulario (actualizar NuevoProducto.tsx)
Ahora vamos a modificar la función "handleSubmit" de el formulario para que use este servicio en lugar de solo mostrar un alert.  

    Actualizamos handleSubmit así:
            TypeScript

¿Qué cambiamos con este paso realmente?
    - async / await: Ahora la función es asíncrona porque la red no es instantánea.  

    - try...catch: Este bloque es obligatorio (en la siguiente fase12). El try intenta enviar la miniatura, y si el servidor está apagado o hay un error, el catch lo captura para que la aplicación no "explote" y mostre el mensaje de error al usuario.

    - Persistencia Real: Ya no usamos alert. Si el código llega a setEnviado(true), significa que tu producto/Dragón ya vive en la memoria del servidor Node.js[cite: 4].

 --- 
 ---

## 3. Seguridad y Validación "en la frontera"

Para el Contrato de la API (REST). Estos son los endpoints que vamos a forjar:

Método Endpoint Acción Código Éxito
nnn / nnn / nnn / nnn
GET 	/api/miniatures	        Obtiene todo el catálogo	        200 OK
POST	/api/miniatures	        Crea una nueva pieza (Dragón Rojo)	201 Created
DELETE	/api/miniatures/:id	    Elimina una pieza	                200 OK

- 0. Paso previo. **DOS TERMINALES**

Para realizar esa acción, necesitaMOS tener dos terminales abiertas simultáneamente, ya que ahora tENEMOS dos aplicaciones independientes (Frontend y Backend) que deben hablar entre sí.

    Termina "1" En backend
        Bash
        En backend, es decir la carpeta server en raiz del proyecto:
        cd server
        Arrancamos el servidor:
        node index.js
            Deberíamos ver el mensaje:  Servidor de la Forja rugiendo en http://localhost:4000

    Terminal "2" La Interfaz, Frontend
        Bash
        En carpeta client
        cd client
        Arrancamos Vite
        npm run dev
            Abrimos el enlace

- 1. Prueba POST. Prueba del 201 (Creación Exitosa)
**NOTA**
Nos dio error, pasamos  a usar Thunderclient

Crear Miniatura (POST) en Thunder Client
Se validó la creación de una nueva pieza en el catálogo obteniendo un código 201 Created.

    Observaciones:
        Status: 201 Created ✅
        Payload: Se envió nombre, precio, categoría y descripción.
        Respuesta: El servidor retornó el objeto con un ID único generado automáticamente.

        ### Evidencia de funcionamiento (POST)
        Se ha verificado la creación de miniaturas mediante Thunder Client, obteniendo un código 201.
    **IMAGEN**:
        ![Prueba POST exitosa](./screenshots/test-post-success.png)


2- Probando la Robustez (Validaciones también en Thunder CLient)
Para cumplir con los códigos 400 y 404 que nos pide el Paso 11, hacemos las siguientes pruebas:

    - Para el 400 (Bad Request): 
    Borramos la línea del "nombre" en el JSON y damos Send. 
    El servidor debería responder con el mesanje de error.

    El servidor devuelve:
            "message": "Nombre y precio son obligatorios"

    - Para el 404 (Not Found): 
    Cambia el método a DELETE y pon una URL que no exista, como http://localhost:4000/api/miniatures/999. 
    
    El servidor devuelve:
            "message": "No se puede borrar lo que no existe"

3. El Paso Final: GET (Lectura)
Cambiamos el método a GET, borramos todo lo que haya en el Body y hacemos Send a la URL principal.

    Resultado esperado: Veremos un array [] con todas las miniaturas que hayamos creado durante las pruebas. Esto confirma que la Capa de Red es bidireccional: "podemos enviar y recibir."

    Confirmado, salio el producto Dragon de escacha y otros productos x
    ![Prueba GET exitosa](./screenshots/test-get-success.png)
