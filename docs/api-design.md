
# Paso 12. Capa de red en el frontend y API-tipado

Crearemos un "cliente de API tipado"
        En programación, el cliente es simplemente el trozo de código que se encarga de ir a buscar cosas fuera. 
                Ejemplo simple: un "mensajero".

        ¿Qué significa "Tipado"?
        Significa que le ponemos una etiqueta de seguridad.

        Sin TypeScript, el mensajero trae una caja y no sabes si dentro hay una miniatura, un error o una pizza. Con Tipado, TypeScript obliga al mensajero a que solo pueda traer cajas que contengan exactamente lo que define tu interfaz Miniature. Si intenta traer otra cosa, el código te avisará antes de que la web explote.


## 1. Capa de Red (Frontend)

1. Crearemos contrato de Tipos
Se utiliza la interfaz `Miniature` para garantizar que el frontend y el backend hablen el mismo idioma.

2. Estados de la UI

3. Eliminaremos el uso de persistencias en LocalStorage. 
Usaremos el "useEffect" para mandar sobre la lista.
Los datos se consumen directamente desde `http://localhost:4000/api/miniatures`.



### Fallo Gestión de Estados de Red
En App.tsx
Tras realizar los cambios en app.tsx en los que introducimos los nuevos estados de carga. Aparecio el error.

1. El Problema: "El Error del Silencio"
Durante la transición de la Fase 3 (datos locales) a la Fase 4 (backend real), la aplicación presentaba dos fallos críticos de experiencia de usuario (UX) y robustez técnica:

    Falta de Feedback: Si el servidor estaba apagado o la ruta era incorrecta, la aplicación se quedaba "congelada" en el estado de carga o mostraba una lista vacía sin explicar por qué.  

    Inconsistencia de Datos: Al usar PRODUCTOS_MOCK, la interfaz no reflejaba los cambios reales realizados mediante peticiones POST en Thunder Client.  

    Error de Tipado: Al intentar implementar el manejo de errores en la UI (App.tsx), TypeScript lanzaba un error de compilación (Cannot find name 'error') porque el Hook encargado de los datos no estaba diseñado para comunicar fallos de red.  

2. Análisis Técnico
El error residía en la Capa de Red del Frontend. El Hook **useProductos** solo gestionaba el éxito de la carga simulada, pero no capturaba excepciones de promesas (Promise) ni exportaba un estado de error hacia los componentes superiores.  

3. La Solución: **Implementación de los 3 Estados de Red**
Para cumplir con los requisitos de robustez, se rediseñó el flujo de datos siguiendo el patrón de Estados de Red:

        - Evolución del Hook (useProductos.ts)
        Se sustituyó la simulación de tiempo (setTimeout) por una llamada real asíncrona usando el servicio tipado miniatureService.getAllMiniatures(). Se añadió un bloque try/catch/finally para asegurar que:

            Carga: setEstaCargando(true) se activa al inicio.  

            Éxito: Los datos del servidor se guardan en el estado productos.  

            Error: Si fetch falla, se captura la excepción y se guarda un mensaje descriptivo en setError.  

        - Refactorización de la UI (App.tsx)
        Se implementó una lógica de renderizado condicional para que la interfaz reaccione según el estado de la conexión:

            Visualización de Error: Se añadió un componente de alerta visual (en rojo) que informa al usuario sobre problemas de conexión y ofrece un botón de reintento.  

            Sincronización: Al eliminar la dependencia de mockData, el frontend ahora usa la API como única fuente de verdad, garantizando que lo que se ve en pantalla es exactamente lo que reside en la base de datos del servidor.  

4. Resultado Final
La aplicación ahora es resiliente. Si el servidor cae, el usuario recibe un mensaje de "Error en la forja". Si el servidor responde, los datos se cargan de forma fluida, eliminando la persistencia artificial del LocalStorage para los datos del catálogo.


## En resumen
Cliente tipado: 

    "He creado un mensajero que me ha dado un ticket (Promise). Ese ticket me garantiza que, cuando vuelva, me entregará una lista ([]) de objetos que tienen exactamente la forma de una miniatura (Miniature)".

¿Por qué esto te salva la vida?
    Porque si mañana intentas escribir mini.titulo pero en tu interfaz pusiste nombre, el editor se pondrá en rojo y te dirá: "¡Ey! El mensajero prometió traerte 'nombre', no 'titulo'".

    Es como tener un corrector ortográfico, pero para los datos de tu base de datos.




