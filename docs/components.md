# Documentación de Componentes - HammerFlow Forge (PASO 6)

## 1. MiniaturaCard
**Descripción:** Tarjeta inteligente que muestra información de productos.
- **Props:** `item: HammerItem` (Unión discriminada).
- **Lógica:** Renderizado condicional según si el tipo es 'VENTA', 'MECENAZGO' o 'TUTORIAL'.
- **Estilos:** Tailwind CSS con efectos hover y bordes naranja.

## 2. GridProductos
**Descripción:** Contenedor que organiza las tarjetas en una cuadrícula responsive.
- **Props:** `items: HammerItem[]`.
- **Patrón:** Composición de componentes.


### 3. Usamos composición de componentes 
PARA que App.tsx sea el "director de orquesta" y delegue el trabajo sucio de hacer el bucle a un componente especializado.

- Creamos el nuevo componente: src/components/GridProductos.tsx

    NOTAS
    ¿Qué significa "Recibir una lista"?
    Significa que el componente no "inventa" los datos ni los busca en una base de datos por su cuenta. En su lugar, espera a que alguien se los pase a través de las Props (como si fuera un paquete que le llega por correo).

    En tu código, la "lista" es el array PRODUCTOS_MOCK.

    El componente GridProductos tiene un "buzón" llamado items que espera recibir un array de tipo HammerItem[].

    Cuando en App.tsx escribes <GridProductos items={PRODUCTOS_MOCK} />, le estás entregando la lista al componente.

    ¿Qué significa "Dibujarla"? (Renderizado)
    Significa transformar esos datos (objetos de texto y números) en elementos visuales (HTML/CSS). Para ello usamos la función .map().

    El proceso: Por cada producto que hay en la lista, React genera una "tarjeta" (MiniaturaCard).

    Si la lista tiene 3 productos, el componente "dibuja" 3 tarjetas.
    Si mañana la lista tiene 100, el componente dibujará 100 automáticamente.
    
    **RESUMEN**
    Recibir la lista: Es cuando el camión llega con una caja llena de miniaturas.

    Dibujarla: Es el acto de sacar cada miniatura de la caja y colocarla ordenadamente en el estante para que los clientes la vean.

- El cambio de jerarquía
Antes, App.tsx dibujaba las tarjetas directamente, así que necesitaba importar MiniaturaCard. Ahora, App.tsx solo dibuja el Grid, y es el Grid el que dibuja las tarjetas.

    Antes: App —> MiniaturaCard (Importación necesaria en App)
    Ahora: App —> GridProductos —> MiniaturaCard

    La limpieza del código
    En React, solo debes importar lo que usas directamente en ese archivo.

    Como en el nuevo App.tsx ya no escribes la etiqueta <MiniaturaCard /> (porque ahora está dentro de GridProductos), la importación ya no hace falta ahí.

    Si la dejaras, tu editor de código te la marcaría en gris suave porque sería "código muerto" o no utilizado.

    ¿Dónde vive ahora esa importación?
    Ahora la importación de MiniaturaCard debe estar únicamente dentro de src/components/GridProductos.tsx, ya que es ese archivo el que realmente utiliza las tarjetas para "dibujar" la lista.

**Resumen visual:**
App.tsx: Solo importa GridProductos y los datos.

GridProductos.tsx: Importa MiniaturaCard para poder repetir cada tarjeta.

MiniaturaCard.tsx: Importa los Tipos y la Lógica para saber qué mostrar.

**¿Qué hemos ganado con esto?**
Reutilización: Si mañana creas una página de "Favoritos", puedes usar el mismo <GridProductos /> pasándole una lista diferente.

Separación de responsabilidades: App gestiona la página, GridProductos gestiona la disposición y MiniaturaCard gestiona el detalle.

Escalabilidad: Cuando en el Paso 7 añadamos filtros, solo tendremos que filtrar la lista en App y el Grid se actualizará solo.


### 4. Ejemplo de crear componentes como listas, tarjetas, formularios o modales que **consuman datos tipados** (de la API o del estado global):

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

