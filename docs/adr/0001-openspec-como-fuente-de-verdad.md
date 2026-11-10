# 0001. Las delta-specs de OpenSpec como fuente de verdad viva

## Contexto

El comportamiento de FlowSync está escrito en `openspec/`, con el esquema `spec-driven` (`openspec/config.yaml`, sin contexto de proyecto ni reglas propias configuradas). Hay dos piezas, y lo que importa es cómo se relacionan:

- **La spec viva**, una por capability: `openspec/specs/tasks/spec.md` (32 requisitos, 124 scenarios) y `openspec/specs/auth/spec.md` (19 requisitos, 45 scenarios). Cada requisito dice qué SHALL hacer el sistema, y cada scenario lo concreta en un par *cuándo / entonces*.
- **Los changes archivados**, en `openspec/changes/archive/`. Hay tres, todos con fecha 2026-08-13, y cada uno trae `proposal.md`, `design.md`, `tasks.md` y sus delta-specs (`ADDED` / `MODIFIED Requirements`):
  - `add-task-list` crea la capability `tasks` con 14 requisitos, modifica 3 de `auth` y le añade 1.
  - `add-task-due-date` añade 11 requisitos a `tasks` y modifica 1.
  - `add-task-status-filter` añade 7 y modifica 4.

La spec viva de `tasks` es exactamente lo que sale de aplicar esos tres deltas en orden: comparados requisito a requisito, coinciden los 32. La de `auth` no: solo 4 de sus 19 requisitos vienen de un delta; los otros 15 no tienen ningún change detrás que explique por qué existen.

El repo ya trae las herramientas del flujo: las skills `openspec-propose`, `openspec-apply-change`, `openspec-sync-specs`, `openspec-verify-change` y `openspec-archive-change` en `.claude/skills/`, y los comandos `opsx` en `.claude/commands/opsx/`.

Lo que ha pasado hasta ahora muestra tanto para qué sirve como dónde falla:

- **Los changes guardan lo que la spec no guarda.** Las decisiones tomadas (el límite de 200 caracteres, el orden de la lista, la vuelta desde `done`), lo que se dejó fuera a propósito y los riesgos. Los tres declaran «sin tests» como decisión explícita.
- **La spec se ha escrito también después del código.** `add-task-status-filter` dice de sí mismo que «documenta comportamiento que ya está implementado», y `add-task-due-date` avisaba de que la spec viva seguía diciendo «todas las tareas del espacio» cuando el filtro ya existía.
- **Archivar no ha impedido que el código se separe de la spec.**
  - El `design.md` del filtro decide `vine.enum(TASK_STATUSES).optional()`. Cinco días después del archivo, el commit `8c15707` lo cambió a `vine.string().optional()` sin tocar `openspec/`, y hoy `GET /api/v1/tasks?status=archivado` responde `200` con una lista vacía, contra el scenario «Estado inventado».
  - `add-task-list` se archivó con la tarea 6.3 («Verificar que ninguna respuesta de tareas incluye el email del responsable») sin marcar. El email salía en la lista, al crear y al cambiar el estado, hasta que un test escrito contra el scenario «La tarea no filtra datos de cuenta» lo destapó y se corrigió en `e330b7d`.
- **Casi nada se comprueba solo.** De los 124 scenarios de `tasks`, solo los 3 de «Lo que cada tarea muestra de su responsable» tienen test (`backend/tests/functional/tasks/assignee.spec.ts`). Entre los changes archivados quedan 9 tareas de verificación manual sin marcar.

## Decisión

La spec viva de `openspec/specs/<capability>/spec.md` es la fuente de verdad del comportamiento de FlowSync, y solo cambia a través de delta-specs.

- **Lo que dice la spec es lo que el sistema debe hacer.** El código, los tests, el documento OpenAPI y el frontend se miden contra ella. Si alguno no coincide, es un defecto que hay que resolver de forma explícita: o se corrige el código, o se cambia la spec con un change. Nunca se da por buena la discrepancia en silencio.
- **Todo cambio de comportamiento pasa por un change** en `openspec/changes/<nombre>/`, con su `proposal.md`, su `design.md`, su `tasks.md` y sus delta-specs. La spec viva no se edita a mano: se actualiza al sincronizar o archivar ese change.
- **Se puede especificar comportamiento ya implementado**, como hizo `add-task-status-filter`, siempre que el proposal lo diga.
- **Los changes archivados son historia y no se reescriben.** Si una decisión cambia, el cambio va en otro change.
- **Los 15 requisitos de `auth` sin change detrás se aceptan como punto de partida tal como están.** No se reconstruye su historia.

## Estado

Aceptada, 2026-11-10. Registra una práctica que el proyecto sigue desde los changes archivados el 2026-08-13.

## Consecuencias

**Lo que se gana:**

- **Un solo sitio por capability** donde leer qué tiene que hacer el sistema, en scenarios lo bastante concretos para verificarlos uno a uno. La matriz de trazabilidad, los tests del responsable y el contraste del documento OpenAPI se hicieron directamente contra ellos.
- **El porqué queda escrito.** Cada cambio de comportamiento deja su motivo, sus decisiones y lo que se dejó fuera, algo que la spec viva sola no conserva.
- **Revisar un cambio de comportamiento es leer un delta**, no la spec entera.
- **La spec viva se puede reconstruir y comprobar** contra los deltas archivados, como se ha hecho para `tasks`.

**Lo que nos cuesta:**

- **Nada obliga a que el código cumpla la spec.** No hay ningún test que una scenarios con código salvo esos 3, ni ninguna comprobación en CI. La decisión depende de la disciplina de quien toca el código, y ya ha fallado: el cambio del validador de `8c15707` y la fuga del email convivieron con una spec que decía lo contrario. Una spec viva que se equivoca es peor que no tenerla, porque se le cree: el comentario de `TasksController.index` y el `design.md` del filtro siguen afirmando un `422` que el código ya no devuelve.
- **Archivar no exige haber verificado.** Un change se archiva con tareas de verificación sin hacer, y la que habría cazado la fuga del email fue una de ellas. Que un change esté archivado no significa que su comportamiento esté comprobado.
- **Mantener la spec pesa.** Un `MODIFIED` reescribe el requisito entero: «Una sola vista de tareas, sin señales de presencia» aparece completo en los tres deltas. Y la spec viva de `tasks` ya tiene 124 scenarios, así que leerla, mantenerla y cruzarla con el código lleva su tiempo.
- **Escribir la spec después del código** la convierte en una descripción y no en un contrato. Mientras el change no se archiva, la spec viva describe un sistema que ya no existe, como pasó con «todas las tareas del espacio».
- **Depende de las herramientas de OpenSpec.** Nadie comprueba la equivalencia entre la spec viva y los deltas: si alguien edita la spec a mano, se rompe sin que nada lo avise.
- **Para 15 requisitos de `auth` no hay porqué registrado.** Quien quiera cambiarlos tiene que deducir su intención solo del texto.
- **La fecha de archivo no dice cuándo se implementó nada.** Los tres changes comparten la misma fecha, aunque al menos uno se escribió con el comportamiento ya implementado.
