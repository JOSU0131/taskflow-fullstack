# Investigación Agile: metodologías de desarrollo en equipos PRO

## 1. ¿Qué es Agile?
Agile es una forma de organizar el trabajo en proyectos de software. La idea principal es no intentar planificarlo todo desde el principio, porque en el mundo real los requisitos cambian, aparecen problemas inesperados y lo que el cliente quiere al principio no siempre es lo que quiere al final.

En vez de eso, Agile propone trabajar en ciclos cortos: entregas pequeñas, revisión de lo que funciona, y ajuste del rumbo según lo que se aprende. El objetivo es tener siempre algo funcional que mostrar y mejorar de forma continua.

Los valores principales de Agile (recogidos en el Manifiesto Ágil de 2001) son:

    - Valorar a las personas y su comunicación por encima de los procesos y herramientas.
    - Tener software que funciona por encima de documentación extensa.
    - Colaborar con el cliente en vez de negociar contratos rígidos.
    Adaptarse a los cambios en vez de seguir un plan a ciegas.

Agile no es una metodología concreta, es más bien una filosofía. Scrum y Kanban son dos formas concretas de aplicarla.

## 2. ¿Qué es Scrum?
Scrum es una metodología concreta que sigue los principios de Agile. Tiene una estructura bastante definida: roles fijos, ciclos de trabajo llamados sprints y reuniones concretas.

Roles en Scrum:
    - Product Owner: Es la persona que decide qué hay que hacer y en qué orden. Representa los intereses del cliente o del negocio. Mantiene y prioriza el backlog (la lista de tareas pendientes).
    - Scrum Master: Se asegura de que el equipo siga las reglas de Scrum y de que no haya obstáculos que frenen el trabajo. No es el jefe del equipo, sino más bien un facilitador.
    - Equipo de desarrollo: Las personas que hacen el trabajo (programadores, diseñadores, etc.). Son autónomos y deciden cómo hacer las tareas.

**Sprints**
Un sprint es un periodo de tiempo fijo (normalmente entre 1 y 4 semanas, lo más habitual son 2) en el que el equipo se compromete a terminar un conjunto de tareas concretas. Una vez empieza el sprint, no se añaden tareas nuevas a mitad: el equipo trabaja en lo que acordó al principio.

**Backlog**
El backlog es la lista de todo lo que hay que hacer en el proyecto, ordenado por prioridad. Hay dos niveles:

    - Product Backlog: la lista completa de todo lo que se quiere construir.
    - Sprint Backlog: el subconjunto de tareas que el equipo se compromete a hacer en ese sprint concreto.

**Reviews y Retrospectivas**
Al final de cada sprint hay dos reuniones importantes: 
Sprint Review: se presenta lo que se ha completado. El Product Owner y el cliente pueden dar feedback.
Retrospectiva: el equipo reflexiona sobre cómo ha trabajado (qué fue bien, qué no, qué cambiar para el siguiente sprint).


## 3. ¿Qué es Kanban? 
Kanban es otra forma de organizar el trabajo, pero mucho más flexible que Scrum. 
No hay sprints, no hay roles fijos y no hay reuniones obligatorias. La herramienta principal es el tablero Kanban.

**El tablero Kanban**
Un tablero Kanban es una representación visual de las tareas. Se divide en columnas que representan el estado de cada tarea. El esquema más básico es:

Por hacer   En proceso  Hecho
Cada tarea es una tarjeta que va moviéndose de izquierda a derecha según avanza.

**Límite de trabajo en curso (WIP)**
La regla más importante de Kanban es el límite de WIP (Work In Progress). Cada columna tiene un número máximo de tareas que puede contener al mismo tiempo. Si la columna "En proceso" tiene límite 2, no puedes empezar una tarea nueva hasta que termines una de las que tienes en curso.

Esto evita que el equipo tenga demasiadas cosas a medias al mismo tiempo, que es uno de los problemas más comunes en el trabajo en equipo.

**Flujo continuo**
En Kanban no hay ciclos cerrados. Las tareas entran cuando llegan y salen cuando se terminan. Es un sistema de flujo continuo, sin fechas de entrega fijas por sprint.

## 4. Diferencias entre Scrum y Kanban

Scrum: 
1- Sprints fijos (1-4 semanas)
2- Roles: Product Owner, Scrum Master, equipo
3- No se permiten "cambios" durante el sprint
4- Reuniones: Daily, Planning, Review, Retrospectiva
5- Métricas: Velocidad del equipo (puntos por sprint)
6- Estructura fija

Kanban:
1- Flujo continuo, sin ciclos
2- No hay Roles definidos.
3- Es más flexiblem, se pueden añadir tareas en cualquier momento
4- No hay reuniones obligatorias
5- Métricas: Tiempo de ciclo (cuánto tarda una tarea en completarse)
6- Estructura muy flexible

## 5. ¿Cuándo usar cada metodología?

**Cuándo usar Scrum**
Scrum funciona bien cuando:

El proyecto tiene un objetivo claro pero los requisitos pueden cambiar entre sprints.
Hay un equipo dedicado y estable que trabaja a tiempo completo en el proyecto.
Es importante entregar funcionalidades completas cada pocas semanas.
El cliente quiere estar involucrado y dar feedback regularmente.

**Ejemplo**: Desarrollo de una aplicación web nueva, donde cada sprint añade una funcionalidad completa que el cliente puede probar.


**Cuándo usar Kanban**
Kanban funciona bien cuando:

El trabajo llega de forma continua e impredecible (no se puede planificar en bloques fijos).
El equipo compagina varias responsabilidades o proyectos a la vez.
Se necesita flexibilidad para añadir o cambiar tareas sin romper un ciclo.
El objetivo es mejorar un proceso existente más que construir algo nuevo desde cero.

**Ejemplo**: Un equipo de soporte técnico que recibe incidencias a lo largo del día, o un equipo de mantenimiento que gestiona bugs y mejoras pequeñas de forma continua.

## Resumen técnico
Tanto Scrum como Kanban son formas de aplicar la filosofía Agile: trabajar de forma iterativa, adaptarse a los cambios y mantener siempre una visión clara de lo que está en curso. La diferencia está en la estructura: Scrum impone un ritmo y unos roles que ayudan a equipos que necesitan organización; Kanban deja más libertad y se adapta mejor a entornos donde el trabajo es impredecible.

En la práctica, muchos equipos acaban usando una combinación de ambos, adoptando los sprints de Scrum y el tablero visual de Kanban según les convenga.


# Resumen en palabras sencillas: 

**Agile** es una forma de trabajar en equipo donde en vez de planificar todo desde el principio y luego ejecutar, vas trabajando en trozos pequeños, revisando y ajustando sobre la marcha. 
El objetivo es entregar algo funcional rápido y mejorar poco a poco en vez de esperar meses para tener algo "perfecto".

**Scrum** es una forma concreta de aplicar Agile. Tiene reglas fijas: trabajas en periodos de tiempo cortos llamados sprints (normalmente 2 semanas). Hay tres roles: 
1. El Product Owner (decide qué hay que hacer y en qué orden) 2. El Scrum Master (se asegura de que el equipo trabaje bien)
3. El equipo de desarrollo (los que hacen el trabajo). Las tareas pendientes se llaman backlog. Al final de cada sprint hay una review donde se enseña lo que se ha hecho.

Por otro lado, **Kanban** es más flexible. No hay sprints ni roles fijos. Solo tienes un tablero con columnas (Por hacer / En proceso / Hecho) y vas moviendo tarjetas de tarea de izquierda a derecha. La clave es limitar cuántas cosas puedes tener "En proceso" a la vez para no saturarte.

**Diferencia clave**: Scrum tiene estructura fija (sprints, roles, reuniones). Kanban es continuo y flexible, sin ciclos.

**Cuándo usar cada uno**: Scrum va bien cuando tienes un proyecto con fases claras y un equipo dedicado. Kanban va mejor para trabajo continuo como soporte técnico o mantenimiento, donde las tareas llegan de forma impredecible.