# Paso 9. Rutas y navegación
Paso 1. Instalar la librería (dentro de la carpeta client):
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


Paso 2. Preparar las carpetas: Crear una carpeta src/pages para separar lo que son "Componentes" (botones, tarjetas) de lo que son "Páginas" (Home, ProductDetail, NotFound).