# Bitacora clonar vieja arquitectura del lab/taskflow 4-react
Para ahorrar tiempo "clonamos" vieja arquitectura en el nuevo proyecto

1. Paso previo, creamos la carpeta del proyecto- "idea Negocio"
2. Viculamos con github.
    Creamos repositorio en git y vinculamos desde terminal.
        Bash:
        git remote add origin https:(dirección del repositorio en github)

3. Creamos un README.md y hacemos comit
        Bash:
        git commit -m "first commit"
4. Cambiamos el "nombre" de master a main del branch principal. Y hacemos primer push
        Bash:
        git branch -M main
        git push -u main

5. Vinculamos el viejo repositorio. (En nuestro SCE, VS code)
Para hacer la copia del repositorio "viejo" (taskflow4-react) hacia la carpeta ya creada y abierta en VS code y ya vinculada a Github.
    Primero. Añadimos el repo. viejo como "remoto temporal"
        Bash
        git remote add viejo-repo https:(dirección del repositorio viejo que queremos copiar)
    Segundo. "Traemos el repositorio viejo con un pull.
        Bash
        git pull viejo-repo main --allow-unrealte-histories
    Tercero. Opcional, limpiamos el "remoto temporal"
        Bash
        git remote remove viejo-repo


# Bitacora Laboratorio 3 y Conclusiones 

## Paso 0.  "Crear" carpeta de lógica

Tener la lógica centralizada en tu proyecto de React no solo te ayuda a cumplir con el laboratorio, sino que hará que tu TaskFlow UI //  sea una aplicación real y no un cascarón vacío.

Vamos a hacerlo de forma organizada para que tu estructura de archivos sea profesional.

1. En VS Code, dentro de la carpeta taskflow-ui/src, crea una nueva carpeta llamada logic.

2. Dentro de src/logic/, crea un archivo llamado matriculas.ts
    Aquí vamos a "fusionar" lo mejor del Módulo 2 con la seguridad del Módulo 3 que acabamos de ver.

    Copia y pega este contenido (que incluye las interfaces y la función refactorizada):
        
    TypeScript
        // src/logic/matriculas.ts

        // 1. Interfaces del Módulo 2 (El "Corazón" de tus datos)
        export interface MatriculaActiva {
            tipo: "ACTIVA";
            asignaturas: string[];
        }

        export interface MatriculaSuspendida {
            tipo: "SUSPENDIDA";
            motivo: string;
        }

        export interface MatriculaFinalizada {
            tipo: "FINALIZADA";
            notaMedia: number;
        }

        // Unión Discriminada
        export type EstadoMatricula = MatriculaActiva | MatriculaSuspendida | MatriculaFinalizada;

        // 2. Interfaz principal del Alumno
        export interface Alumno {
            id: string; // Añadimos ID para que React pueda manejar listas
            nombre: string;
            estado: EstadoMatricula;
        }

        // 3. Lógica con el "Análisis Exhaustivo" (Requisito Módulo 3)
        export function generarReporte(estado: EstadoMatricula): string {
            switch (estado.tipo) {
                case "ACTIVA":
                    return `En curso: ${estado.asignaturas.join(", ")}`;
                case "SUSPENDIDA":
                    return `Pausada por: ${estado.motivo}`;
                case "FINALIZADA":
                    return `Completada. Media: ${estado.notaMedia}`;
                default:
                    // 🛡️ El guardián 'never' que pide el laboratorio
                    const _check: never = estado;
                    return _check;
            }
        }
        - - -

### Refactorizamos el Código en App.tsx
Para que tu código sea limpio y profesional, lo ideal es separar la lógica (los datos) de la vista (el HTML/React).

Los datos (misAlumnos) deben ir fuera de la función App (si son estáticos) o dentro de un useState si quieres que cambien. Para este laboratorio, vamos a ponerlos justo debajo de los imports.

    TypeScript
        import { useState } from 'react'
        import reactLogo from './assets/react.svg'
        import viteLogo from './assets/vite.svg'
        import heroImg from './assets/hero.png'
        import './App.css'

        // 1. Importamos la interfaz que creamos en src/logic/matriculas.ts
        import { Alumno, generarReporte } from './logic/matriculas';

        // 2. Definimos los datos (Fuera de la función para que no se recreeen en cada render)
        const misAlumnos: Alumno[] = [
        { 
            id: "1", 
            nombre: "Daniel", 
            estado: { tipo: "ACTIVA", asignaturas: ["TypeScript", "React"] } 
        },
        { 
            id: "2", 
            nombre: "Josu", 
            estado: { tipo: "FINALIZADA", notaMedia: 9.5 } 
        }
        ];

        function App() {
        const [count, setCount] = useState(0)

        return (
            <>
            <section id="center">
                <div className="hero">
                <img src={heroImg} className="base" width="170" height="179" alt="" />
                <img src={reactLogo} className="framework" alt="React logo" />
                <img src={viteLogo} className="vite" alt="Vite logo" />
                </div>
                <div>
                <h1>TaskFlow: Panel de Alumnos</h1>
                
                {/* 3. Renderizamos los datos usando la lógica del Módulo 2/3 */}
                <div style={{ textAlign: 'left', background: '#222', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                    {misAlumnos.map(alumno => (
                    <div key={alumno.id} style={{ marginBottom: '10px', borderBottom: '1px solid #444' }}>
                        <p><strong>👤 {alumno.nombre}</strong></p>
                        <p style={{ color: '#646cff' }}>📊 {generarReporte(alumno.estado)}</p>
                    </div>
                    ))}
                </div>

                </div>
                
                <button
                className="counter"
                onClick={() => setCount((count) => count + 1)}
                style={{ marginTop: '20px' }}
                >
                Interacciones: {count}
                </button>
            </section>

            {/* El resto de tus secciones (ticks, next-steps, etc.) se quedan igual abajo */}
            <div className="ticks"></div>
            {/* ... rest of your code ... */}

🧐 ¿Por qué lo hacemos así?
Separación de conceptos: La lógica de qué texto mostrar (generarReporte) vive en un archivo aparte. Si mañana cambias las reglas de las matrículas, no tienes que tocar el HTML.

Seguridad de Tipos: Si en misAlumnos intentas poner una nota media a un alumno "ACTIVO", TypeScript te lo subrayará en rojo en este mismo archivo.

HMR (Hot Module Replacement): Como estás usando Vite, en cuanto guardes este archivo, verás aparecer la lista de alumnos en tu navegador instantáneamente.


## Paso 1. Instalar Luxon y librerias de terceros (@types). Todo en uno.
En carpeta raiz taskflow4-react
    Bash
        npm install luxon
        npm install --save-dev @types/luxon
    - - -

🧐 ¿Cómo compruebo que se ha hecho bien?
Abre tu archivo package.json (está en la raíz). Deberías ver:

luxon dentro de "dependencies".

@types/luxon dentro de "devDependencies".

Esto es precisamente lo que comentabas antes de los archivos .d.ts. Al instalar el paquete @types, le estás diciendo a TypeScript: "Oye, aquí tienes el manual de instrucciones para entender Luxon".

## Paso 2-3. Manejo de librerías externas
Ya tenemos los cimientos (Luxon instalado). Ahora vamos a construir las piezas que pide el laboratorio para que tu proyecto pase de "plantilla de Vite" a "arquitectura profesional"

1. Crear la utilidad de fechas (Librería externa)
Como ya tienes Luxon, vamos a crear una función que use esa librería con tipado estricto.

    En la carpeta src, crea una carpeta "llamada utils".
    Dentro de utils, crea el archivo "dateUtils.ts".

    TypeScript
        import { DateTime } from 'luxon';

        export const obtenerDiasDesde = (fechaISO: string): number => {
        const fecha = DateTime.fromISO(fechaISO);
        const hoy = DateTime.now();

        // El método .diff puede devolver NaN si la fecha es inválida
        const diferencia = hoy.diff(fecha, 'days').days;

        // Usamos el operador || para asegurar que siempre devolvemos un número
        return Math.floor(diferencia || 0);
        };
        - - -

2. Crear la Tabla Genérica (Utility Types: Partial)
Este es el punto clave del Módulo 3. Vamos a usar un Genérico <T> y un Utility Type (Partial<T>).

    En la carpeta src, crea una carpeta llamada components.
    Dentro de components, crea el archivo DataTable.tsx.

    Typescript
        import { useState } from 'react';

        // T representa cualquier objeto que tenga un ID
        interface DataTableProps<T extends { id: string | number }> {
        titulo: string;
        datos: T[];
        columnas: { clave: keyof T; etiqueta: string }[];
        }

        export function DataTable<T extends { id: string | number }>({ titulo, datos, columnas }: DataTableProps<T>) {
        
        // 🛠️ USO DE UTILITY TYPE: Partial<T>
        // 'Partial' hace que todas las propiedades de T sean opcionales.
        // Es perfecto para un estado de "edición" temporal.
        const [elementoEditando, setElementoEditando] = useState<Partial<T> | null>(null);

        return (
            <div style={{ padding: '20px', border: '1px solid #646cff', borderRadius: '12px', margin: '20px 0' }}>
            <h2>{titulo}</h2>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ borderBottom: '1px solid #444' }}>
                    {columnas.map((col) => (
                    <th key={String(col.clave)} style={{ padding: '10px' }}>{col.etiqueta}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {datos.map((fila) => (
                    <tr 
                    key={fila.id} 
                    onClick={() => setElementoEditando(fila)} 
                    style={{ cursor: 'pointer', borderBottom: '1px solid #222' }}
                    >
                    {columnas.map((col) => (
                        <td key={String(col.clave)} style={{ padding: '10px' }}>
                        {String(fila[col.clave])}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
            </table>

            {elementoEditando && (
                <div style={{ marginTop: '15px', color: '#646cff', fontSize: '0.9rem' }}>
                📝 Seleccionado para editar: ID {elementoEditando.id} (Usando Partial&lt;T&gt;)
                </div>
            )}
            </div>
        );
        }
        - - -

3. Integración final en App.tsx
Ahora vamos a "limpiar" tu "App.tsx" para que muestre tanto tus Alumnos (Lógica del Módulo 2) como tu nueva Tabla (Módulo 3).

    TypeScript
        import { useState } from 'react'
        import reactLogo from './assets/react.svg'
        import viteLogo from './assets/vite.svg'
        import heroImg from './assets/hero.png'
        import './App.css'

        // 1. Lógica del Módulo 2
        import { Alumno, generarReporte } from './logic/matriculas';

        // 2. Componentes y Utilidades del Módulo 3
        import { DataTable } from './components/DataTable';
        import { obtenerDiasDesde } from './utils/dateUtils';

        // Interfaz para la Galería (Requisito de datos complejos)
        interface Obra {
        id: string;
        titulo: string;
        artista: string;
        fechaIngreso: string;
        }

        const misAlumnos: Alumno[] = [
        { id: "1", nombre: "Daniel", estado: { tipo: "ACTIVA", asignaturas: ["TypeScript", "React"] } },
        { id: "2", nombre: "Josu", estado: { tipo: "FINALIZADA", notaMedia: 9.5 } }
        ];

        const misObras: Obra[] = [
        { id: "OB-01", titulo: "Noche Estrellada", artista: "Van Gogh", fechaIngreso: "2023-01-10" },
        { id: "OB-02", titulo: "Guernica", artista: "Picasso", fechaIngreso: "2024-02-15" }
        ];

        function App() {
        const [count, setCount] = useState(0)

        return (
            <>
            <section id="center">
                <div className="hero">
                <img src={heroImg} className="base" width="170" height="179" alt="" />
                <img src={reactLogo} className="framework" alt="React logo" />
                <img src={viteLogo} className="vite" alt="Vite logo" />
                </div>
                
                <div>
                <h1>TaskFlow: Panel de Control</h1>
                
                {/* SECCIÓN ALUMNOS (Módulo 2 + never) */}
                <div style={{ textAlign: 'left', background: '#222', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
                    <h3>👥 Estado de Alumnos</h3>
                    {misAlumnos.map(alumno => (
                    <div key={alumno.id} style={{ marginBottom: '10px', borderBottom: '1px solid #444' }}>
                        <p><strong>{alumno.nombre}</strong></p>
                        <p style={{ color: '#646cff' }}>{generarReporte(alumno.estado)}</p>
                    </div>
                    ))}
                </div>

                {/* SECCIÓN TABLA GENÉRICA (Módulo 3: Genéricos + Partial) */}
                <DataTable 
                    titulo="🏛️ Inventario Galería"
                    datos={misObras}
                    columnas={[
                    { clave: 'titulo', etiqueta: 'Obra' },
                    { clave: 'artista', etiqueta: 'Autor' }
                    ]}
                />

                {/* SECCIÓN LUXON (Librería externa) */}
                <p style={{ fontSize: '0.9rem', color: '#888' }}>
                    Info: La primera obra llegó hace {obtenerDiasDesde(misObras[0].fechaIngreso)} días.
                </p>
                </div>
                
                <button className="counter" onClick={() => setCount((c) => c + 1)} style={{ marginTop: '20px' }}>
                Interacciones: {count}
                </button>
            </section>

            <div className="ticks"></div>
            </>
        )
        }

        export default App
- - -


### Verificación técnica
(El "Test del Algodón") hay que asegurarse de que TypeScript no tiene ninguna queja "escondida".

    Abre tu terminal en la carpeta taskflow4-react y ejecuta:
    npx tsc --noEmit

Saliò vacío (0 errores): ¡Perfecto! Tu código es robusto.
Todo bien en terminal, no salió nada.



## Conclusiones  y Defensa de la Arquitectura y Gestión de Errores

En esta sección se detalla cómo el uso de TypeScript avanzado ha fortalecido la aplicación en comparación con un desarrollo en JavaScript estándar:

### 1. Robustez con Análisis Exhaustivo (`never`)
Al utilizar el tipo `never` en el bloque `default` de nuestro `switch` en `generarReporte`, hemos creado un sistema a prueba de futuro. 

**En JS estándar**: Si añadimos un nuevo tipo de matrícula (ej. "BECADO") y olvidamos programar su lógica, el sistema fallaría silenciosamente en tiempo de ejecución devolviendo `undefined`.

**En nuestro proyecto**: El compilador de TypeScript arrojará un error inmediato si la unión `EstadoMatricula` crece y no es manejada totalmente, garantizando que el 100% de los casos estén cubiertos antes de desplegar.

### 2. Flexibilidad Segura con Genéricos (`DataTable<T>`)
La implementación de `DataTable<T>` permite que un solo componente maneje de forma segura tanto `Alumnos` como `Obras`. 

**Uso de `keyof T`**: Garantiza que las columnas pasadas por props existan realmente en el objeto, evitando errores de "propiedad no encontrada" muy comunes en objetos dinámicos de JS.

### 3. Estados Temporales con `Partial<T>`
El uso de `Partial<T>` para el estado de edición reconoce la realidad del desarrollo de interfaces: los datos en un formulario suelen estar incompletos mientras el usuario escribe.

**Ventaja**: Nos permite inicializar el estado de edición sin necesidad de crear un objeto "falso" con valores vacíos, manteniendo la relación de tipo con la entidad original pero permitiendo que sus campos sean opcionales temporalmente.

### 4. Contratos Estrictos con Librerías Externas (Luxon)
Al integrar Luxon con sus definiciones de tipo (`@types/luxon`), eliminamos la ambigüedad en el manejo de fechas.
- Nuestra función `obtenerDiasDesde` asegura mediante tipos que la entrada es un `string` (ISO) y la salida siempre un `number`, manejando internamente los posibles valores `NaN` o nulos de la librería mediante cortocircuitos (`|| 0`), algo que en JS puro suele causar errores matemáticos difíciles de rastrear.


### Conclusiones. El valor de TypeScript en el Ciclo de Vida del Software

Este proyecto demuestra que el uso de tipos avanzados no es solo una capa decorativa, sino una red de seguridad crítica.

Dispone de **mantenibilidad**: Gracias al Análisis Exhaustivo.
La abstracción de **calidad**: Gracias a la "DataTable<T>" genérica elimina la necesidad de duplicar lógica para diferentes tipos de datos.
Y la revención de errores en "Runtime": Gracias al uso de "Partial<T>" y la integración estricta de **Luxon** permiten manejar la incertidumbre de la entrada de datos del usuario y de librerías externas sin el riesgo de errores.

En conclusión, la arquitectura implementada reduce la carga cognitiva del desarrollador y garantiza una interfaz de usuario predecible y robusta, cumpliendo con los estándares de la industria moderna.

