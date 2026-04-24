
# 1. El Plan de Acción
Inicialmente, la gestión de la interactividad se planteó directamente en App.tsx. El objetivo era permitir al usuario filtrar las miniaturas por categoría mediante una interfaz reactiva.

Vamos a añadir un estado en App.tsx que guarde qué categoría ha seleccionado el usuario. Luego, filtraremos la lista de PRODUCTOS_MOCK antes de pasársela al GridProductos

## Hooks Fundamentales Utilizados:
**useState**: Lo utilizamos para controlar la interactividad. Permite que React "recuerde" qué categoría ha pulsado el usuario y repinte la interfaz automáticamente al cambiar.
Una especie de filtrado

**useMemo**: Lo usamos para el filtrado de la lista. Evita que la aplicación tenga que volver a filtrar los cientos (o miles) de productos cada vez que la página se actualiza por otra razón, ahorrando memoria y procesador.

- 1. Modificando App.tsx (con useState y useMemo)

Typescript
    //0.
    import { useState, useMemo } from 'react'; // Importamos los Hooks

En function
    // 1. GESTIÓN DE ESTADO (useState)
    // Guardamos la categoría seleccionada. 'null' significa "Ver todo".
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);

    // 2. OPTIMIZACIÓN (useMemo)
    // Solo recalculamos la lista filtrada si cambia la categoría o los datos.
    
    const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return PRODUCTOS_MOCK;
    return PRODUCTOS_MOCK.filter(item => item.categoria === categoriaSeleccionada);
    }, [categoriaSeleccionada]);

    // 3. Lista de categorías únicas para los botones
    const categorias: Categoria[] = ['Fantasía', 'Bustos', 'Monstruos', 'Tutorial Pintado'];

    return (...
    <header> ...

    // 4. BARRA DE FILTROS 
        <div className="flex flex-wrap gap-3 mt-8">
          <button 
            onClick={() => setCategoriaSeleccionada(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!categoriaSeleccionada ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Todos
          </button>
          
          {categorias.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${categoriaSeleccionada === cat ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              {cat}
            </button>
            ))}
        </div>
    </header>


# 2. Añadir Custom Hook y usar useEffect
Para elevar la calidad del código, encapsulamos toda la lógica en un Custom Hook.

NOTA:
*Un Custom Hook es, en esencia, una función de JavaScript/TypeScript que utiliza otros Hooks de React (como useState, useEffect o useMemo) para encapsular una lógica específica.*

Responsabilidades del Hook (en este paso):

useProductos (Custom Hook): Reúne toda la lógica de gestión de datos, estados de carga y filtrado en una sola función reutilizable, manteniendo los componentes visuales limpios.
    
useEffect: Se encarga de manejar los "efectos secundarios". En este caso, dispara un temporizador al montar el componente para simular la latencia de una red real.

Typescript
      // SIMULACIÓN DE CARGA (useEffect)
    // Usamos useEffect para simular que los datos vienen de una base de datos
    useEffect(() => {
    const timer = setTimeout(() => {
      setEstaCargando(false);
    }, 1200); // 1.2 segundos de "Loading"

useMemo: Memoriza la lista filtrada. Si el usuario cambia de pestaña y vuelve, pero no cambia el filtro, React no pierde tiempo volviendo a filtrar los datos.

     // FILTRADO OPTIMIZADO (useMemo)
    const productosFiltrados = useMemo(() => {
    if (!categoriaSeleccionada) return PRODUCTOS_MOCK;
    return PRODUCTOS_MOCK.filter(item => item.categoria === categoriaSeleccionada);
    }, [categoriaSeleccionada]);   


# 3. Actualizamos App.tsx:
Para que solo le "pide" las cosas al hook. Ahora usamos un Custom Hook (useProductos), App.tsx no necesita saber de dónde vienen los datos (si están en un archivo local como mockData.ts o si vienen de una base de datos en Internet).

    
En el paso 0, obtenemmos **Facilidad de Cambio (Mantenibilidad)**
        Antes: App.tsx buscaba los ingredientes en la despensa (PRODUCTOS_MOCK).

        Ahora: El Hook useProductos es quien va a la despensa. App.tsx simplemente recibe el plato preparado.

Ejemplo:
    Imagina que mañana decides cambiar tus datos falsos por una API real.

    Si no usaras el Hook: Tendrías que ir a App.tsx y a todos los componentes que usen los datos para cambiar las importacione

El archivo useProductos.ts es ahora el único responsable de leer ese archivo de datos para filtrarlos y gestionar el estado de carga.


Typescript
    0. Eliminamos 
    import { PRODUCTOS_MOCK } from './data/mockData';
    
    Y LO MAS IMPORTANTE ahora usamos
    import { useProductos } from './hooks/useProductos';

Centralización de la Lógica
        Antes: En App.tsx tenías que importar useState y useMemo porque la "maquinaria" del filtrado estaba a la vista de todos. El archivo tenía que saber cómo filtrar y cómo gestionar el estado.

        Ahora: Todo eso se ha movido al "cerebro" llamado useProductos. App.tsx ya no necesita saber qué es un useMemo o un useState; solo necesita saber que useProductos le dará la lista de productos ya lista.


    1. Extraemos todo lo necesario de nuestro Custom Hook
    function App() { 
    const { 
    productosFiltrados, 
    categoriaSeleccionada, 
    setCategoriaSeleccionada, 
    estaCargando 
    } = useProductos();

## Simplificación de Importaciones
Antes: Tu lista de importaciones crecía con cada nueva funcionalidad de React que necesitabas (como useEffect para la carga o useMemo para el rendimiento).

Ahora: Solo importas una cosa: tu propio Hook useProductos. Esto hace que el código de App.tsx sea mucho más corto y fácil de leer para cualquier desarrollador.

## El concepto de "Caja Negra"
Este es el cambio más importante en cuanto a mentalidad de programación:

Antes: App.tsx era el responsable de HACER el trabajo (filtrar, contar, cargar).

Ahora: App.tsx es el responsable de MOSTRAR el trabajo. Le pide a useProductos lo que necesita y confía en que el Hook lo hará correctamente.


**Resumen**
Al crear useProductos.ts, lo que estás haciendo es crear el "Cerebro" de tu aplicación fuera de la vista visual.

    - Estado de la Categoría (useState): Guarda qué filtro ha seleccionado el usuario (Fantasía, Bustos, etc.).
    - Estado de Carga (useState): Un booleano (true/false) que nos dice si estamos esperando a que los datos se "descarguen".
    - Simulador de Red (useEffect): Una función que espera poco más de un segundo antes de mostrar los productos, simulando una conexión real a un servidor.
    - Filtro Inteligente (useMemo): El cálculo que decide qué productos mostrar basándose en la categoría elegida, pero que solo se repite si el usuario cambia el filtro.

# 4. Resumen técnico
En esta fase del desarrollo, hemos migrado la lógica de la aplicación desde un modelo monolítico en App.tsx hacia un modelo basado en Custom Hooks. Esta transición mejora la escalabilidad, la legibilidad y la separación de responsabilidades del proyecto.

### Tabla comparativa de Evolución Arquitectónica

Característica              Implementación Anterior (Estándar)                          Implementación Actual (Profesional)

Ubicación de la Lógica	    Dispersa dentro de los componentes visuales (App.tsx).	        Centralizada en el Custom Hook useProductos.t

Gestión de Importaciones	Múltiples hooks nativos (useState, useMemo, useEffect).	        Un único punto de entrada: useProductos.

Estado de Carga	            Inexistente (la app parpadeaba al cargar).	                    Sincronizado mediante un booleano estaCargando.

Mantenibilidad	            Alta dificultad; riesgo de "Prop Drilling" y archivos extensos.	    Alta eficiencia; lógica aislada de la interfaz de usuario.