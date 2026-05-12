# Paso 15. Retrospectiva del Proyecto: HammerFlow Forge

## 1. Aprendizajes principales

Durante el desarrollo de esta plataforma he conectado por primera vez el
ecosistema completo de un proyecto fullstack moderno:

**Frontend (React + TypeScript + Tailwind v4)**
React 19 con hooks (useState, useEffect, useMemo, useCallback) y dos custom
hooks propios (useProductos y useFavoritos como segundo hook bonus). TypeScript
estricto con `verbatimModuleSyntax`, `noUnusedLocals` y todo el resto.
Aprendí lo que es una **unión discriminada** y para qué sirve, y de paso
me topé con el problema de aplicar `Omit` sobre ellas (que se resuelve con
un conditional type distributivo).

**Backend (Node + Express)**
Arquitectura por capas: routes → controllers → (en este caso datos en memoria,
en un proyecto real iría una capa de servicios + DB). REST con verbos HTTP
correctos y códigos de estado coherentes (200/201/400/404). Validación "en
la frontera de red" en el controller.

**Capa de red**
La parte que más me costó conceptualmente. Entender que el cliente y el
servidor son dos mundos separados que tienen que hablar el mismo "idioma"
(los tipos), y que la comunicación es asíncrona (`async/await`, los 3 estados
loading/error/data). Crear un `ApiError` tipado que viaja del server al
componente fue un cambio mental importante: pasar de "errores como strings"
a "errores como objetos con información estructurada".

**Documentación de API**
Aprendí que documentar la API no es un extra: es un contrato. Con Swagger
puedo generar la doc automáticamente desde los comentarios JSDoc, y cualquier
persona que llegue al repo puede probar los endpoints sin leer el código.

**Testing**
Vitest + RTL me dieron la sensación de "red de seguridad" por primera vez.
Cuando refactoricé `MiniaturaCard` para añadirle el corazón, los tests existentes
me confirmaron que no había roto el comportamiento básico.

**Deploy en Vercel monorepo**
Uno de los puntos más frustrantes y más educativos. Aprender que `vercel.json`
es el director de orquesta, que las "Serverless Functions" no son servidores
permanentes, y que hay que diferenciar entre URLs de desarrollo y producción
con variables de entorno.



## 2. Decisiones arquitectónicas que tomé y el porqué

### 2.1 Unión discriminada para los items
Tres tipos (VENTA, MECENAZGO, TUTORIAL) con propiedades diferentes pero
relacionadas. Podría haber hecho una "interface gigante con campos opcionales",
pero entonces TypeScript no me ayudaría a validar que un MECENAZGO tenga
`fechaFin`. Con la unión discriminada, dentro de un `if (item.tipo === 'MECENAZGO')`
TS sabe que ahí dentro existe `meta`, `recaudado` y `fechaFin`.

### 2.2 Context API para favoritos, no para todo
El paso 8 pedía Context, y al principio estuve tentado de meter ahí también
los productos. Decidí que no: los productos cambian (se cargan, se filtran,
se buscan) y meter eso en Context provocaría re-renders en componentes que
no consumen los productos. **Favoritos** sí cabe bien en Context porque los
necesitan tres puntos lejanos (card, navbar, página de favoritos) y cambian
poco.

### 2.3 Solo IDs de favoritos en localStorage
Pensé en guardar el item entero. Lo descarté porque si una pieza se borra
o se actualiza en el backend, el localStorage tendría una versión obsoleta.
Guardando solo los ids, el localStorage funciona como un "índice" y la
fuente de verdad sigue siendo el backend.

### 2.4 Lazy loading de páginas
Al principio pensé "5 páginas no es para tanto". Pero al ver el bundle
crecer con las nuevas páginas, decidí splittearlas. Cada página viaja en
su propio chunk y solo se descarga al visitarla. La galería se renderiza
antes porque el navegador no parsea el código de las otras vistas.

### 2.5 Skeleton en vez de spinner
Pequeño cambio, gran diferencia de UX percibida. Un spinner dice "espera",
un skeleton dice "ya está casi" y tiene la forma del contenido que va a
aparecer. Lo aprendí mirando webs como Twitter/X y YouTube.

### 2.6 Buscador con debounce
Si filtro en cada tecla, con muchos productos podría ralentizar el render.
Con un debounce de 250ms espero a que el usuario "pare de escribir" antes
de filtrar. El segundo custom hook (useDebounce) salió de aquí.



## 3. Errores que cometí y cómo los resolví

### Error 1 — Inconsistencia en el tipado (versión inicial)
En las primeras fases TypeScript lanzaba errores porque el componente esperaba
un tipo `Miniature` pero el archivo de tipos definía la entidad principal
como `HammerItem`. Hice una auditoría de `miniatures.ts` y unifiqué todo a
`HammerItem`. Esto enseñó la importancia de "una sola fuente de verdad" para
los tipos.

### Error 2 — Desincronización de nombres en el servicio (versión inicial)
Llamaba a `miniatureService.getAllMiniatures()` cuando el método se llamaba
solo `getAll()`. Errores de "Property does not exist". Renombré para que
el servicio fuese consistente.

### Error 3 — El `as any` que tapaba el bug del POST
Para que TypeScript dejase de quejarse con el formulario, usé `as any`. Esto
ocultó un desajuste real: el frontend enviaba `titulo` pero el backend
validaba `nombre`. Toda creación de productos devolvía 400 silenciosamente,
pero el toast verde del cliente engañaba.

**Lección dura**: `as any` no resuelve problemas, los esconde. El fix correcto
fue alinear los nombres de campos entre cliente y server, y refactorizar el
controller para validar según el `tipo` del item.

### Error 4 — Duplicación entre App.tsx y pages/Home.tsx
En algún momento moví la home a su propia página, pero no actualicé la
ruta. Quedaron dos versiones del mismo componente, una de las cuales no se
usaba. Lo descubrí en la auditoría final.

**Lección**: cuando refactorizo, cierro el ciclo. Mover lógica a un archivo
nuevo NO termina hasta que el sitio que la usaba originalmente la importa.

### Error 5 — Omit<HammerItem, 'id'> y la unión discriminada colapsada
Asumí que `Omit` se aplicaría "a cada miembro de la unión por separado".
No fue así: TS colapsa la unión. La solución (un conditional type
distributivo `T extends HammerItem ? Omit<T, 'id'> : never`) fue muy útil
porque ahora entiendo cómo manipular uniones en TS.

### Error 6 — Olvidar la variable de entorno VITE_API_URL en producción
Al desplegar la primera versión en Vercel, la app intentaba conectar a
`localhost:4000`. Aprendí a usar `import.meta.env.VITE_API_URL` con un
fallback a "" (mismo origen) y a configurar la variable en Vercel.



## 4. Cómo utilicé IA durante el desarrollo

Usé un asistente IA durante todo el proyecto. Me ayudó especialmente en:

**Donde la IA brilló:**
- Explicar conceptos de TypeScript que no entendía (uniones discriminadas,
  conditional types distributivos).
- Sugerir patrones idiomáticos (el `useFavoritosContext` que lanza error si
  se usa fuera del Provider, en vez de devolver null).
- Detectar bugs latentes que yo no había visto en el código que ya tenía
  (el caso del POST validando `nombre` cuando se enviaba `titulo`).
- Dar plantillas de configuración (vitest.config.ts, swagger.js) que yo
  ajusté después.
- Documentación: la IA me ayudó a estructurar este propio archivo, pero la
  reflexión personal la escribí yo.

**Donde tuve que tener cuidado:**
- A veces la IA propone "soluciones perfectas" que añaden complejidad
  innecesaria (libraries que no necesito, abstracciones prematuras). Aprendí
  a preguntar "¿esto es necesario para mi caso?" en lugar de aceptarlo
  todo.
- Cuando el código generado era largo, no copiaba sin leer. Me obligaba a
  entender cada línea para luego saber depurarla.
- Los nombres de variables que sugiere la IA a veces no encajan con el
  estilo del resto del proyecto. Hice "find & replace" para renombrar y
  mantener coherencia (todo en español, snake_case en CSS, camelCase en
  JS).

**Lo que aprendí del proceso de trabajar con IA:**
- Funciona mejor cuando le doy contexto del proyecto entero (estructura de
  carpetas, decisiones tomadas, estilo de código), no preguntas aisladas.
- Es una herramienta de pensamiento, no un autocompletado mágico. La
  responsabilidad sobre lo que se queda en el repo sigue siendo mía.
- Cuando algo no funciona, "explicar el error con sus propias palabras" antes
  de pedir ayuda me ha hecho entender mejor el problema yo solo.



## 5. Qué me llevo para el próximo proyecto

1. **Definir los tipos primero, los componentes después.** Cuando el modelo
   está bien tipado, todo lo demás encaja.
2. **No usar `as any`. Si tengo que usarlo, hay un problema más profundo.**
3. **Backend y frontend deben hablar el mismo idioma desde el primer commit.**
   Los nombres de los campos son contrato.
4. **Validación en ambos lados (cliente + server).** El cliente para UX rápida,
   el server porque cualquiera puede saltarse el cliente con curl.
5. **Tests desde el principio, aunque sean dos.** El primer test es el más
   caro de escribir (montar todo el setup), los siguientes son baratos. Si
   los dejo para "el final", a veces "el final" no llega.
6. **Documentación viva.** Esta bitácora se ha vuelto el sitio donde busco
   "cómo arreglé X" cuando me vuelve a pasar.
7. **Skeleton > spinner.** Cuesta lo mismo y se siente más profesional.
8. **Lazy loading no cuesta nada con React.lazy + Suspense, y se nota.**



## 6. Reflexión final personal

Empezar este proyecto siendo "estudiante de desarrollo web" y terminar con
una app que tiene API documentada con Swagger, tests automáticos pasando,
deploy en producción y arquitectura por capas... ha sido la primera vez que
he sentido "esto se parece a lo que hacen en una empresa".

Lo más importante no es el resultado final, sino el camino: cada bug que
arreglé me enseñó algo, cada decisión que tomé (incluso las malas) me dio
material para la siguiente. La parte de TypeScript estricto que al principio
odiaba, ahora la valoro: los errores en compile-time son los más baratos de
arreglar.

Ahora cuando miro código de otra gente entiendo POR QUÉ usan `useMemo` o
POR QUÉ separan en capas. Antes era cargo cult ("lo hago porque lo hacen los
demás"), ahora es decisión informada.

Sigo siendo estudiante. Pero ya no del mismo nivel que cuando empecé.
