# Paso 8. Context y estado global

- Introducción
En esta etapa, el objetivo es que si el usuario añade algo al carrito o selecciona un filtro y recarga la página, esa información no se pierda. Además, es el momento de añadir esos "detalles de calidad" que hacen que una web se sienta premium.

    Persistencia: Implementación de localStorage para mejorar la experiencia de usuario (UX).

    Sincronización: Uso de useEffect para mantener el estado de la aplicación sincronizado con el almacenamiento del navegador.

    Hooks avanzados: Creación de hooks genéricos para manejo de API del navegador.

## 1. Persistencia con localStorage
Vamos a hacer que la aplicación "recuerde" la última categoría que visitó el usuario. Para ello, modificaremos nuestro Custom Hook useProductos.

Modificación en src/hooks/useProductos.ts
Añadiremos un **useEffect** adicional que guarde la categoría cada vez que cambie:

TypeScript // Dentro de useProductos.ts

// Debajo de los imports

        export const useProductos = () => {
        // 1. INICIALIZACIÓN CON LOCALSTORAGE
        // En lugar de empezar en 'null', revisamos si hay algo guardado en el navegador
        const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(() => {
            const guardado = localStorage.getItem('hammer-categoria');

            // Si existe, lo devolvemos como el estado inicial; si no, usamos null
            return guardado ? (guardado as Categoria) : null;
        });

## 2. PERSISTENCIA AUTOMÁTICA (Nuevo useEffect)
Cada vez que 'categoriaSeleccionada' cambie, actualizamos el localStorage. 

Añadimos
Typescript
        useEffect(() => {
            if (categoriaSeleccionada) {
            localStorage.setItem('hammer-categoria', categoriaSeleccionada);
            } else {
            // Si es null (botón "Todos"), limpiamos la entrada para no ocupar espacio
            localStorage.removeItem('hammer-categoria');
            }
        }, [categoriaSeleccionada]);


## ¿Qué ha cambiado exactamente?
    Estado Inteligente: Al pasarle una función a useState, React solo la ejecuta una vez al cargar la página. Esto evita que la aplicación se "olvide" de lo que el usuario estaba viendo si pulsa F5.

    Efecto de Guardado: Hemos añadido un useEffect que escucha específicamente a categoriaSeleccionada. Su única misión es "espejar" lo que haya en el estado hacia el disco duro del navegador (localStorage).

    Limpieza: Usamos removeItem cuando la categoría es null para mantener el almacenamiento del navegador limpio.