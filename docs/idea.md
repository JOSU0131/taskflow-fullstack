# Idea de plataforma de Hobby: Un Marketplace, Mecenazgo y Formación

# 1. El Problema que Resuelve

Los entusiastas del hobby/artistas a menudo se encuentran con una barrera "técnica" a la hora de generar beneficio en el mundo de internet.
También suelen tener dificultades a la hora de ofrecer servicios especificos como: venta de figuras, publicitar y promover nuevos proyectos (crowdfunding) y cómo ofrecer clases de formación técnica. 

**HammerFlow Forge** (nombre prueba) centraliza estas necesidades en una plataforma profesional que gestiona el negocio del hobby/artista.


- **Coleccionistas de figuras:** Usuarios interesados en adquirir piezas exclusivas y terminadas.
- **Mecenas (Backers) y  Encargos:** Personas que buscan apoyar el desarrollo de nuevos diseños o prototipos a cambio de recompensas o compras por encargo.
- **Aprendices de pintura:** Usuarios que buscan contenido educativo estructurado (tutoriales y clases premium).

El problema no es que esos sitios no existan, es que no están pensados específicamente para este hobby. Las tiendas genéricas no tienen el contexto del coleccionista, las plataformas de crowdfunding son demasiado generalistas, y los tutoriales en YouTube están mezclados con millones de otros vídeos.
Esta plataforma centraliza las tres cosas en un solo sitio, con una interfaz limpia y pensada para este tipo de necesidades

# 2. Usuario Objetivo
Hay tres perfiles principales:

El coleccionista / comprador: Quiere comprar figuras pintadas o sin pintar, de calidad, con fotos reales (no renders). Valora la calidad, la transparencia en el stock y los tiempos de entrega.

El mecenas / encargos: Quiere apoyar a pintores o diseñadores que están desarrollando algo nuevo (una línea de figuras, un juego propio) a cambio de recompensas exclusivas. Le importa saber cuánto falta para que el proyecto llegue a su meta y cuándo cierra.

El aprendiz: Quiere aprender a pintar miniaturas. Busca tutoriales cortos, bien organizados, con nivel de dificultad indicado.


# 3. Funcionalidades Principales (MVP)
Estas son las funcionalidades que tiene que tener la versión inicial para que la plataforma tenga sentido:

- Catálogo de figuras

    Listado de figuras disponibles con foto real, precio, estado de stock y tiempo estimado de entrega.
    Filtrado por categoría (pintada / sin pintar / conversiones).
    Cada figura tiene su ficha detallada con galería de imágenes propias.

- Proyectos de mecenazgo

    Listado de proyectos activos con barra de progreso de recaudación.
    Cuenta atrás en tiempo real hasta el cierre del proyecto (calculada con Luxon).
    Niveles de recompensa por aportación.
    Estado del proyecto: en campaña / financiado / en producción / entregado.

- Sección de formación

    Tutoriales en vídeo cortos (embebidos desde YouTube).
    Cada tutorial tiene: nivel de dificultad, duración, técnica que enseña y materiales necesarios.
    Filtrado por nivel (principiante / intermedio / avanzado) y por técnica.

## (NO LEER, OPCIONAL) Arquitectura de datos con tipos discriminados
Los tres tipos de contenido (figura en venta, proyecto de mecenazgo, tutorial) comparten una base común pero tienen datos específicos distintos. 

Esto se implementará con Uniones Discriminadas en TypeScript:
        typescripttype ItemVenta = {
        tipo: 'venta';
        precio: number;
        stock: number;
        tiempoEntrega: string;
        };

        export interface ItemMecenazgo = {
        tipo: 'mecenazgo';
        meta: number;
        recaudado: number;
        fechaCierre: string;
        };

        type ItemTutorial = {
        tipo: 'tutorial';
        urlYoutube: string;
        duracion: number;
        dificultad: 'principiante' | 'intermedio' | 'avanzado';
        };

type Item = ItemVenta | ItemMecenazgo | ItemTutorial;
Esto garantiza que la lógica de la app sea robusta y que cada tipo de contenido se renderice correctamente según sus datos.

- Gestión de tiempos con Luxon

Días restantes para el cierre de un mecenazgo.
Antigüedad de los tutoriales.
Tiempo estimado de entrega para figuras por encargo.
    TypeScript
        import { DateTime } from 'luxon';

        export function obtenerDiasRestantes(fechaISO: string): number {
            const cierre = DateTime.fromISO(fechaISO);
            const ahora = DateTime.now();
            const diferencia = cierre.diff(ahora, 'days').days;
            return Math.ceil(diferencia || 0);
        }


# 4. Funcionalidades Opcionales

Perfil de usuario: historial de compras, proyectos apoyados y tutoriales vistos.
Sistema de valoraciones: puntuaciones y comentarios en figuras y tutoriales.
Notificaciones: aviso cuando un proyecto de mecenazgo está a punto de cerrar o cuando se añade un tutorial nuevo de una técnica que el usuario sigue.
Modo oscuro / claro: la interfaz base es clara y limpia, pero con opción de modo oscuro.
Wishlist: lista de deseos para figuras que no están disponibles aún.


# 5. Posibles Mejoras Futuras

Panel de creador: que pintores o diseñadores puedan subir sus propios proyectos de mecenazgo y tutoriales directamente desde la plataforma, sin que tenga que hacerlo un administrador.
Integración con pasarela de pago real (Stripe o similar) para gestionar compras y aportaciones.
App móvil (React Native) usando la misma lógica de tipos que ya existe en el frontend web.
Sistema de niveles para aprendices: que el usuario pueda llevar un seguimiento de su progreso en los tutoriales y desbloquear contenido avanzado.
Comunidad: foro o feed interno donde los usuarios comparten fotos de sus proyectos pintados.


# 6. (NO LEER, OPCIONAL) Estructura del Proyecto
src/
├── logic/
│   └── hammerflow.ts       # Tipos discriminados y lógica de negocio
├── components/
│   ├── CatalogoFiguras.tsx
│   ├── TarjetaMecenazgo.tsx
│   └── TarjetaTutorial.tsx
├── data/
│   └── datos_ejemplo.ts    # Datos de prueba para el MVP
└── App.tsx
docs/
├── idea.md                 # Este archivo
└── agile.md

# 7. Conexión a github

Github: https://github.com/JOSU0131/taskflow-fullstack
