# Prompts de la réplica de la sesión

Todos los prompts de la sesión, en el orden en que se lanzaron, con el modelo y la herramienta de
cada uno. Van pegados tal cual se lanzaron, con sus faltas y sus saltos de línea.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Lee los scenarios de `openspec/specs/tasks/spec.md` y los tests que haya en `backend/tests/`. Genera una tabla de trazabilidad: cada scenario → qué prueba lo cubre → cubierto/NO cubierto/No lo sé. Cuenta cuántos scenarios hay en total y cuántos están cubiertos, y ponlo arriba. No cambies ningún archivo: esto es una lectura, no un arreglo.
```

**Qué salió:** tabla de los 124 scenarios: 0 cubiertos, 124 no cubiertos y ningún «no lo sé», porque en `backend/tests/` solo había tests de `auth`.

---

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe los tests de integración que faltan para los scenarios del requirement «Lo que cada tarea muestra de su responsable» de `openspec/specs/tasks/spec.md`: uno por cada scenario, en `backend/tests/functional/tasks/` siguiendo el estilo de los que ya existen en `backend/tests/functional/auth/`. No toques nada fuera de `backend/tests/`. Después de escribirlos ejecutalos y si algún test falla, no arregles el código y déjalo fallando, y no aflojes el test para que pase. Si algo se pone rojo, se queda rojo y se entrega rojo: quiero saber qué está mal para verificarlo sin taparlo.
```

**Qué salió:** tres tests en `assignee.spec.ts`, con 22 en verde y 1 en rojo: el email del responsable salía en `POST /tasks`, `GET /tasks` y `PATCH /tasks/:id/status`. Se abrió el PR #1 en el fork y el `adversarial-reviewer` no encontró nada que invalidara los tests.

---

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Afina las reglas de proceso de `CLAUDE.md` (`AGENTS.md` es un symlink que apunta ahí): la rama es por unidad de trabajo, no por petición — si ya estás en una rama de trabajo que no sea `main` ni una `sN/*`,
sigue en ella en vez de crear otra. El commit sí es por petición, con la skill `/commit`. Y `gh pr create` y el pase del subagente `adversarial-reviewer` van una sola vez, al terminar la unidad de trabajo, no al cerrar cada petición. No cambies nada más del archivo.
```

**Qué salió:** reglas reescritas a la primera, y aplicadas ya en esa misma petición: se siguió en la misma rama y no se abrió otro PR. La línea «Responde solo con la URL del PR» se quedó sin encajar con el nuevo flujo.

---

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Arregla el fallo que acaban de destapar los tests del responsable, y no toques nada más. El comportamiento correcto está en ese mismo requisito de `openspec/specs/tasks/spec.md`: la tarea lleva el nombre y las iniciales de su responsable, y no lleva su email. No cambies los tests para que pasen: el que tiene que cambiar es el código.
```

**Qué salió:** `TaskTransformer` pasó a usar `TaskAssigneeTransformer`. Fue un cambio de dos líneas, sin tocar los tests, y la suite quedó en 23 de 23 en verde.

---

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Analiza la estructura real de este proyecto (rutas, controladores, modelos, transformers, la capa de datos y el frontend de React) y genera un diagrama de contenedores estilo C4 en sintaxis Mermaid. Guárdalo en `docs/architecture.md`, con un párrafo corto encima que explique qué muestra. Usa solo lo que exista en el código: si algo no lo puedes verificar leyendo archivos, no lo dibujes.
```

**Qué salió:** diagrama `C4Container` con la aplicación web, la API y la base de datos, validado con el parser oficial de Mermaid. Quedaron fuera el despliegue, el guard `web` y el registro Tuyau, porque no se podían verificar.

---

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Registra las rutas del documento OpenAPI en `start/routes.ts` usando `openapi.registerRoutes()`, tal como pide la documentación del paquete que acabamos de configurar, y cambia en `config/openapi.ts` el título y la versión que dejó el configure por defecto para que nombren a FlowSync. Después dime en qué URL exacta queda servido el documento y en qué URL la interfaz, leyéndolo de la configuración y no de lo que suele ser por defecto.
```

**Qué salió:** el documento quedó en `http://localhost:3333/api.json` y la interfaz en `http://localhost:3333/api`. La ruta no sale de `config/openapi.ts`, sino del valor por defecto de `registerRoutes()`. Se partía del paquete ya configurado fuera de esta sesión.

---

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Contrasta el documento OpenAPI servido en `/api.json` con los scenarios de `openspec/specs/tasks/spec.md`. Dime dos cosas por separado: primero, qué exige la spec que el documento NO recoge (parámetros, códigos de respuesta, forma de los objetos); y segundo, si algún scenario de la spec no tiene ningún endpoint que lo sirva. Cita el scenario en cada caso.
```

**Qué salió:** el documento solo listaba las rutas, sin respuestas, cuerpos, query ni esquemas, y declaraba `security: []`. Ningún scenario se quedaba sin endpoint. De paso salieron a la luz el `id` duplicado y que `?status=archivado` responde `200` con la lista vacía.

---

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Cierra ahora la lista que acabas de darme: decora los controladores de tasks con los decoradores de `@foadonis/openapi` para que el documento recoja lo que la spec exige — el parámetro `status` con sus valores, los códigos de respuesta de cada operación y la forma de los objetos que devuelve. Los esquemas que se repitan van en `backend/app/openapi/schemas.ts` y se publican en `components.schemas`, para que el documento los describa una vez y cada respuesta los referencie. No cambies rutas, validadores ni comportamiento: hoy solo se anota lo que el código ya hace. Al terminar, vuelve a servir el documento y dime qué puntos de la lista quedan cubiertos y cuáles no.
```

**Qué salió:** respuestas y once esquemas publicados en `components.schemas`. `status` quedó como texto y no como `enum`, porque el código acepta cualquier valor. Hubo que forzar el reinicio del servidor de desarrollo por el subpath `#openapi/*` nuevo. Quedaron sin cubrir el token, los cuerpos de petición y `today`.

---

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe un ADR en formato Nygard, con sus cinco apartados (título, contexto, decisión, estado, consecuencias), que registre la decisión de usar las delta-specs de OpenSpec como fuente de verdad viva de este proyecto. Usa como contexto lo que hay de verdad en `openspec/`: las specs, los changes archivados y cómo se relacionan. Guárdalo en`docs/adr/0001-openspec-como-fuente-de-verdad.md`. En consecuencias no pongas solo ventajas: incluye lo que esta decisión nos cuesta.
```

**Qué salió:** ADR 0001. Se comprobó que la spec viva de `tasks` coincide requisito a requisito con los tres deltas aplicados en orden (32 de 32), y que 15 requisitos de `auth` no tienen ningún change detrás.

---

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Supongamos que dentro de un año dejamos de mantener las specs de OpenSpec y pasamos a que los tests de integración sean la única fuente de verdad ejecutable. Escribe el ADR que registra ese cambio en `docs/adr/0002-tests-como-fuente-de-verdad-ejecutable.md`, y actualiza el estado del ADR 0001 para que quede marcado como reemplazado por este, con el enlace. No borres ni reescribas el contenido del 0001: su contexto y su decisión siguen siendo lo que se creía entonces.
```

**Qué salió:** ADR 0002, y el 0001 marcado como reemplazado añadiendo una sola línea a su estado. Las fechas quedaron en 2027, así que el repo da por tomada una decisión que hoy es solo un supuesto.

---

## Prompt 11

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Genera el README de la capability de tareas en `docs/capabilities/tasks/README.md`: qué hace, qué endpoints expone, qué reglas de negocio tiene y cómo se prueba en local. Sácalo del código y de `openspec/specs/tasks/spec.md`, y enlaza la spec en vez de copiar sus reglas, para que no haya dos sitios donde se puedan desincronizar.
```

**Qué salió:** README con los 32 requisitos enlazados a la spec y el sitio del código donde se aplica cada uno. Se comprobaron los 34 enlaces relativos y todas las anclas. Añadió por su cuenta una sección de «Desviaciones conocidas» que no se había pedido.

---

## Prompt 12

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade a `CLAUDE.md`, en la sección de reglas de proceso, una regla corta: cuando un cambio toque rutas, controladores, validadores o transformers de una capability, en el mismo commit hay que regenerar el documento OpenAPI y actualizar el README de esa capability en `docs/capabilities/<nombre>/README.md`. Escríbela con el mismo tono y formato que las reglas que ya están ahí, y no añadas ninguna otra.
```

**Qué salió:** regla añadida con un paréntesis que explica qué significa «regenerar» en este repo, porque no existe ningún comando que genere el documento OpenAPI.

---

## Prompt 13

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
guarda los prompts de la sesión en `prompts-replica-sesion.md` tomando como muestra formato y lineamientos en `prompts.md`
```

**Qué salió:** este archivo.
