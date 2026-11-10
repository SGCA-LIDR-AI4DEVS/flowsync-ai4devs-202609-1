# 0002. Los tests de integración como fuente de verdad ejecutable

## Contexto

El [ADR 0001](0001-openspec-como-fuente-de-verdad.md) hizo de la spec viva de `openspec/specs/` la fuente de verdad del comportamiento, cambiada solo a través de delta-specs. Sus propias consecuencias ya señalaban el coste principal: nada obliga a que el código cumpla la spec, y la decisión depende de la disciplina de quien lo toca.

Eso ya había fallado cuando se tomó 0001, y por la misma razón las dos veces:

- **El validador del filtro.** El commit `8c15707` cambió `listTasksValidator` de `vine.enum(...)` a `vine.string()` sin tocar `openspec/`. La spec siguió pidiendo un `422` ante un estado inventado mientras el código respondía `200` con una lista vacía, y nada lo detectó.
- **El email del responsable.** Salía en la lista, al crear y al cambiar el estado, contra el scenario «La tarea no filtra datos de cuenta», y la verificación manual que lo habría visto se quedó sin hacer en `add-task-list`. Lo detectó un test de integración (`backend/tests/functional/tasks/assignee.spec.ts`) la primera vez que se ejecutó.

La spec describe y los tests comprueban. Cuando no coinciden, solo los tests lo dicen, y mantener las dos cosas a mano es pagar dos veces por una verdad que solo una de ellas vigila.

Los tests de integración del backend ya tienen dónde apoyarse:

- **Suite y runner:** Japa, con la suite `functional` declarada en `adonisrc.ts`.
- **Cliente HTTP tipado:** el registro Tuyau de `.adonisjs/client/registry/`.
- **Aislamiento:** cada test corre en una transacción global (`testUtils.db().withGlobalTransaction()`).

El frontend, en cambio, no tiene ningún runner de tests.

## Decisión

Los tests de integración de `backend/tests/functional/` son la única fuente de verdad ejecutable del comportamiento de FlowSync. `openspec/` deja de mantenerse.

- **Lo que un test afirma es lo que el sistema debe hacer.** Lo que ningún test afirma no está garantizado, aunque hoy funcione.
- **Todo cambio de comportamiento lleva su test en el mismo cambio.** Si un test se pone rojo, o se está cambiando el comportamiento a propósito, y se dice, o es un defecto que se arregla en el código. Un test no se afloja para que pase.
- **Los títulos de los tests describen el comportamiento en castellano**, como ya hacen los de `auth` y `tasks`, para que la suite se pueda leer como lo que el sistema promete.
- **El porqué va en los ADR y en la descripción de cada PR**, no en la suite.
- **`openspec/` se queda en el repositorio tal como está, de solo lectura.** No se borra, porque sus changes archivados siguen explicando por qué se tomaron las decisiones, pero no se actualiza ni se usa para decidir qué hace el sistema.
- **El comportamiento de la interfaz queda fuera de esta fuente de verdad** mientras el frontend no tenga runner de tests.

## Estado

Aceptada, 2027-11-10. Reemplaza al [ADR 0001](0001-openspec-como-fuente-de-verdad.md).

## Consecuencias

**Lo que se gana:**

- **Una discrepancia se pone roja en vez de quedarse callada.** Los dos casos que 0001 no evitó, el validador y el email, son justo los que un test convierte en un fallo visible.
- **Se mantiene un solo artefacto.** Cambiar el comportamiento es cambiar un test, y eso se revisa en el mismo diff que el código.
- **Lo que se dice que hace el sistema y lo que hace no pueden separarse sin que se note**, al menos para lo que tiene test.

**Lo que nos cuesta:**

- **La verdad se vuelve tan estrecha como los tests.** Un test solo garantiza lo que afirma. El de los datos de acceso del responsable comprueba el email y las credenciales, pero no que el `assignee` lleve solo nombre e iniciales, como pedía el requisito, así que lo que el test no mira pasa a estar permitido sin que nadie lo haya decidido. Con 0001, una regla existía aunque nadie la probara. Ahora, una regla sin test no existe.
- **Se pierde el porqué.** Los proposals y los `design.md` registraban las decisiones, lo que se dejaba fuera a propósito y los riesgos. Un test dice qué, no por qué, y que el porqué llegue a los ADR o a los PR depende otra vez de la disciplina.
- **Las reglas de que algo no exista se vuelven difíciles de escribir.** Requisitos como «No hay lista personal», «El catálogo de estados no se toca» o «Sin señales de presencia» son ausencias: un test de integración las expresa mal o no las expresa, y dejan de estar escritas en ninguna parte ejecutable.
- **La interfaz se queda sin fuente de verdad.** Sin runner en el frontend, todo su comportamiento (la pantalla de la lista, el filtro en la URL, los mensajes de lista vacía) no tiene nada que lo fije: ni una spec mantenida ni un test.
- **Producto pierde el documento común.** Los scenarios en *cuándo / entonces* se podían leer y discutir sin abrir código. Una suite de Japa no, y la conversación sobre qué debe hacer el sistema pasa a necesitar a alguien que lea TypeScript.
- **Un test frágil es una verdad frágil.** La suite `functional` usa el mismo fichero SQLite que el servidor de desarrollo, y depende de la transacción global para no ensuciarlo. Si un test falla por el entorno y no por el comportamiento, la fuente de verdad miente, y la tentación de saltárselo es justo la que esta decisión prohíbe.
- **`openspec/` congelado seguirá pareciendo cierto.** Los cinco ficheros de tests actuales citan en su cabecera requisitos de `openspec/specs/`, y algunos comentarios del código también. Esas referencias apuntan a un documento que nadie mantiene, que se irá separando del sistema y al que se seguirá creyendo si nadie lo avisa.
- **El documento OpenAPI tampoco se contrasta.** Sus esquemas siguen escritos a mano en `app/openapi/schemas.ts` y nada los compara con los tests, así que puede separarse del comportamiento igual que lo hacía la spec.
