---
name: priority-ticket
description: Trae de Jira el ticket de mayor prioridad asignado al usuario actual en «Por hacer», resume sus criterios de aceptación, entra en plan mode y propone cómo implementarlo. Al aprobar el plan mueve el ticket a «En curso»; al crear el pull request lo mueve a «En revisión» y comenta el enlace del PR. Úsala cuando el usuario pida el siguiente ticket, el ticket prioritario o invoque /priority-ticket.
---

# /priority-ticket

Ciclo completo de un ticket de Jira a través del MCP `atlassian`: traerlo, planificarlo, marcarlo en curso y, cuando exista el PR, pasarlo a revisión.

Guarda durante toda la sesión el `cloudId` y la clave del ticket (p. ej. `FS-12`): las fases 3 y 4 los necesitan.

## Fase 1 — Localizar el ticket

1. Obtén el `cloudId` con `getAccessibleAtlassianResources` (una sola vez). Si hay más de un sitio, pregunta al usuario cuál usar.
2. Busca con `searchJiraIssuesUsingJql`:

   ```
   assignee = currentUser() AND status = "Por hacer" ORDER BY priority DESC, created ASC
   ```

   Con `maxResults: 5`. El primer resultado es el ticket: mayor prioridad y, a igualdad, el más antiguo.
3. Si no hay resultados, **para** y díselo al usuario. No sustituyas el estado por otro parecido ni quites el filtro de asignado. Si sospechas que el estado tiene otro nombre en este tablero, consúltalo con `statusCategory = "To Do"` solo para informar al usuario y deja que él decida.
4. Trae el ticket completo con `getJiraIssue` (`view: "evidence"`) para tener descripción, criterios de aceptación y enlaces.

## Fase 2 — Resumir y planificar

1. Muestra al usuario: clave, título, prioridad, enlace al ticket y los **criterios de aceptación** como lista numerada, tal como están escritos (resume la descripción, no los criterios).
2. Entra en plan mode con `EnterPlanMode`.
3. Investiga el código antes de proponer nada. Lee y sigue las convenciones de `CLAUDE.md`/`AGENTS.md` y, cuando el ticket nombre endpoints del backend, lee los validadores, controladores y transformers reales: el ticket es de producto y no especifica todo lo que el backend exige (campos obligatorios, formato de respuesta `{ data: ... }`, códigos de error).
4. Propón el plan con `ExitPlanMode`. El plan incluye:
   - Archivos a crear o modificar.
   - Cómo se cubre cada criterio de aceptación, uno por uno.
   - Requisitos del backend que el ticket no menciona y que descubriste en el código.
   - Dudas abiertas, si las hay.

## Fase 3 — Al aprobar el plan: «En curso»

Solo si el usuario aprueba el plan. Si lo rechaza o pide cambios, no muevas el ticket: ajusta el plan y vuelve a proponerlo.

1. Lista las transiciones disponibles del ticket: usa `discover` para obtener la operación de listar transiciones de una issue y ejecútala con `executeRead` (con `cloudId` como argumento de primer nivel).
2. Elige la transición cuyo **estado destino** sea «En curso». El nombre de la transición puede no coincidir con el del estado.
3. Aplícala con `transitionJiraIssue` usando su `transitionId`, y confirma al usuario el estado en que quedó.
4. Implementa el plan siguiendo las reglas de proceso de `CLAUDE.md`.

## Fase 4 — Al crear el PR: «En revisión» + enlace

En cuanto el pull request exista (creado según las reglas de `CLAUDE.md`, normalmente con `gh pr create`):

1. Toma la URL del PR que devolvió `gh pr create` (o `gh pr view --json url -q .url`).
2. Lista de nuevo las transiciones y aplica la que lleve al estado **«En revisión»** con `transitionJiraIssue`.
3. Añade un comentario al ticket con `addOrEditJiraIssueComment`:

   ```
   Pull request: <URL del PR>
   ```

4. Si la transición o el comentario fallan, reinténtalo una vez con la entrada corregida. Si vuelve a fallar, avisa al usuario con la URL del PR para que lo haga a mano. Nunca des el ticket por movido sin la confirmación de `transitionJiraIssue`.

## Reglas

- No muevas el ticket a ningún estado distinto de «En curso» y «En revisión», ni en otro momento que el indicado.
- No edites el título, la descripción ni los criterios del ticket.
- Si alguna transición no está disponible desde el estado actual, no la fuerces con estados intermedios: informa al usuario de las transiciones que sí existen.
