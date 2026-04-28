# Paso 10: La Forja de Datos

Vamos a empezar por crear un formulario para "Añadir una nueva Miniatura". Esto nos servirá para entender cómo React "escucha" lo que el usuario escribe.

    Concepto Clave: Componentes Controlados
    En React, los formularios son "controlados". Esto significa que cada letra que escribes en un input se guarda inmediatamente en el Estado (useState). **React** es el dueño absoluto de lo que aparece en pantalla.

## 0. Preparación del terreno
Necesitamos una nueva página donde "viva" este formulario y actualizar nuestro doc "App.tsx"

1. Creamos un nuevo archivo en src/pages/ llamado NuevoProducto.tsx

2. Nueva ruta en App.tsx para que podamos entrar en /nuevo.
        - Nuevo import:
        import NuevoProducto from './pages/NuevoProducto';
        - Nueva pagina:
        <Route path="/nuevo" element={<NuevoProducto />} />

NOTA: typescript nos advertirá en App.tsx  "/pages/NuevoProducto has no default export" lo que significa que el sistema intenta importar algo que no existe, al no tener aún codigo export en el doc. NuevoProducto.tsx

3. Creamos la estructura básica en "NuevoProducto.tsx"
        
        **NOTA**: NO olvidar añadir codigo de export e import
        En JavaScript/React, cuando haces un import NuevoProducto from '...', el archivo de destino está obligado a tener una línea que diga "export default". Si el archivo está en blanco, el import se queda "colgado".

- Typescript. // Primera versión del formulario en pagina-documento "NuevoProducto.tsx"
        import { useState } from 'react';
        import { Link } from 'react-router-dom';

    // linea de codigo para el export hacia el doc App.tsx
        export default function NuevoProducto() {

    // Estado para el nombre de la miniatura
        const [nombre, setNombre] = useState('');

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            alert(`¡Miniatura "${nombre}" lista para la batalla!`);
        };

        return (
            <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                Forjar <span className="text-orange-500">Nueva Unidad</span>
                </h2>
                <Link to="/" className="text-slate-400 hover:text-white text-sm font-bold underline">
                Volver
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">
                    Nombre de la Miniatura
                </label>
                <input 
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    placeholder="Ej: Dragón Rojo"
                />
                </div>

                <button 
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-lg uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20"
                >
                Añadir al Inventario
                </button>
            </form>
            </div>
        );
        }

## 1. Formulario completo
Para que este formulario sea "útil" necesitamos que sea un poco más complejo. Los prodcuto es una tienda no solo tienen nombre, también suelen necesitar precio, categoría y quizás una descripción.

1. Ampliamos el formulario en pagina-documento "NuevoProducto.tsx"
Definimos los Estados (useState). Concepto "cubos", donde el usuario guardara la información que escribe.

    Creamos cuatro estados: nombre, precio, categoria y descripcion.
    //    Estados para cada campo
        const [nombre, setNombre] = useState('');
        const [precio, setPrecio] = useState('');
        const [categoria, setCategoria] = useState<Categoria | ''>('');
        const [descripcion, setDescripcion] = useState('');
    Y   
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
    // Aquí es donde validaríamos los datos antes de enviarlos
            console.log({ nombre, precio, categoria, descripcion });
            alert(`¡El ${nombre} ha sido catalogado por ${precio} un bitcoin!`);
        };

        **NOTA** ¿Por qué? 
        En React, si no guardas lo que se escribe en un "estado", la información se pierde cada vez que el componente se actualiza. El estado es la memoria a corto plazo de tu componente.

**NOTA IMPORTANTE** No olvidar añadir
        // Importamos el tipo que ya creamos
        import type { Categoria } from '../types/miniatures';

2. Crear los Inputs. Concepto de "componente controlado"
Un componente controlado es un input que React domina al 100%.
    
    A cada <input> le ponemos dos propiedades clave:   
        value={estado}: Le decimos al input: "Tu valor es exactamente lo que diga mi estado".
        Y
        onChange={(e) => setEstado(e.target.value)}: Le decimos: "En cuanto el usuario pulse una tecla, actualiza mi estado inmediatamente".

        **NOTA MUY IMPORTANTE** ¿Por qué? 
        Si solo pones el input, React no sabe qué hay dentro. Al "controlarlo", React sabe en todo milisegundo qué ha escrito el usuario. Esto permite, por ejemplo, impedir que alguien escriba números en el nombre o letras en el precio en tiempo real (sería un desaste para el negocio)

3. Creamos el Selector de Categorías. El (select)
Creamos un desplegable con las opciones que definimos en tu tipo Categoria.
        
        **NOTA** ¿Por qué?
        Queremos que el usuario elija una categoría válida (Fantasía, Bustos, etc.) y no que escriba cualquier cosa. Usar un select asegura que los datos sean consistentes con el resto de tu galería.

4. Creamos el envío. El (handleSubmit)
Creamos una función que se dispara cuando el usuario hace clic en el botón "Forjar". Usamos e.preventDefault().
        
        **NOTA** ¿Por qué?
        Por defecto, los formularios de toda la vida intentan recargar la página al enviarse. En React (SPA), no queremos que la página se recargue, queremos capturar los datos y decidir nosotros qué hacer con ellos (como guardarlos o mostrar un mensaje).


## 2. Typescript. // Segunda versión con cada sección explicado
Despues de definir los Estados (useState), de no olvidar los imports iniciales y actualizar el validador (const handleSubmit)

1. Creamos el contenedor principal. El (div exterior)
// Aquí se crea la "caja" o tarjeta donde vive el formulario.

TypeScript
        <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl">

- Resumen de clases Tailwind:
    1. max-w-2xl mx-auto: Centra la caja y le da un ancho máximo cómodo para leer (ni muy ancha ni muy estrecha).
    2. bg-slate-800: Le da ese color gris muy oscuro/azulado tipo metal.
    3. p-8: Añade relleno interno para que el contenido no toque los bordes.
    4. rounded-xl: Redondea las esquinas para un look moderno.
    5. border border-slate-700: Añade un borde sutil para que resalte sobre el fondo de la web.
    6. shadow-2xl: Le da una sombra profunda para que parezca que la tarjeta "flota" sobre la mesa de trabajo.

2. La cabecera flexible (div interior)
TypeScript
        <div className="flex justify-between items-center mb-8">

    Resumen: Es una fila que organiza el título y el botón de volver. El flex y justify-between empujan el título a la izquierda y el enlace de "Volver" a la derecha, dejando espacio entre ellos. El mb-8 es el margen inferior para separarlo de los inputs.

3. El Título Estilizado (h2)
Creamos El nombre de la página.
TypeScript
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
        Registrar <span className="text-orange-500">Nueva Pieza</span>
        </h2>

    Resumen: Usamos font-black (letra muy gorda) y tracking-tighter (letras muy juntas) para darle un estilo agresivo y potente. El span con text-orange-500 hace que la palabra "Pieza" resalte con tu color corporativo naranja.

4. El Enlace Inteligente (Link)
Esto es la puerta de salida para volver a la Home.

TypeScript
        <Link to="/" className="text-slate-500 hover:text-orange-500 text-sm font-bold transition-colors">
        ← Volver a la Galería
        </Link>

    Por qué es especial: Usamos <Link> de React Router en lugar de un <a>.

    Resumen: Esto permite que al pulsar "Volver", la web cambie de página al instante, sin que el navegador tenga que recargar o parpadear. El hover:text-orange-500 hace que el texto se ilumine en naranja cuando pasas el ratón por encima, indicando que es clicable.

### En pocas palabras:
Este bloque de código es el encabezado de tu tarjeta de formulario con estilos TAILWIND.

Y asegura que el usuario sepa dónde está ("Registrar Nueva Pieza") y tenga una forma rápida y elegante de volver atrás si se arrepiente de algún paso o encargo realizado.


## 3. Validamos con una prueba para entender el "Componente Controlado"
Para que ver "la magia" del *onChange* y el estado, vamos a añadir un "espía" temporal en tu código.

    1. En tu archivo NuevoProducto.tsx, añadimos un console.log, justo antes del return
    Typescript
    // ESTO ES EL ESPÍA:
    console.log("El estado actual del nombre es:", nombre);

    2. Subimos el cambio a github, y vemos la web en vercel. 
    En la direción de navegación escribimos /nuevo:
            // *https://taskflow-fullstack-psi.vercel.app/nuevo*

    3. Pulsamos F12 (o Clic derecho > Inspeccionar) y vamos a la pestaña Console.

    4. En la pagina web, en el campo de nombre, empezamos a escrir la palabra "Dragón"

    ¿Qué verás?
        Escribes D -> La consola dice: El estado actual del nombre es: D
        Escribes r -> La consola dice: El estado actual del nombre es: Dr
        Escribes a -> La consola dice: El estado actual del nombre es: Dra

    Al escribir la palabra Dragón salio una "cascada" de mensajes.

    Esa cascada de mensajes en la consola es la prueba irrefutable de que has dominado el Componente Controlado.

### Resumen de la prueba
¿Qué está pasando exactamente detrás de las cámaras?
Cada vez que pulsas una tecla para escribir "Dragón", ocurre este ciclo infinito a la velocidad del rayo:

        1. Evento: Pulsas la 'D'. El navegador lanza un evento onChange.
        2. Captura: Tu código captura esa 'D' con e.target.value.
        3. Actualización: Llamas a setNombre('D').
        4. Sincronización: React recibe el nuevo valor, guarda 'D' en su memoria (el Estado) y vuelve a dibujar el componente.
        5. Reflejo: El input ahora muestra 'D' porque su value está amarrado al estado.

¿Por qué esto es mejor que el método antiguo?
En el desarrollo web antiguo, el programador tenía que ir al HTML y "preguntar": ¿Oye, qué hay escrito en esta caja?. Con React, tú no preguntas, tú ya lo sabes, porque la información vive en tu código, no solo en la pantalla.