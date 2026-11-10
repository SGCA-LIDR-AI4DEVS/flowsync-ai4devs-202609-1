# Capability `tasks`

La lista de trabajo compartida del equipo. Cada tarea tiene título, responsable, estado y, si se quiere, una fecha de vencimiento. Las tareas se crean desde la lista, se les cambia el estado desde su fila y se abren en una pantalla propia, donde se pone o se quita la fecha. La lista se puede acotar por estado.

**Las reglas de negocio están en la spec, [`openspec/specs/tasks/spec.md`](../../../openspec/specs/tasks/spec.md), y este README no las repite.** Lo que hay aquí es dónde se aplica cada una en el código, qué endpoints expone la capability y cómo probarla en local. Si algo de este fichero contradice a la spec, manda la spec.

## Endpoints

Todos van bajo `/api/v1/tasks`, exigen `Authorization: Bearer <token>` y responden JSON envuelto en `{ "data": … }`.

| Método | Ruta | Controlador | Entrada | Respuesta correcta | Errores |
|---|---|---|---|---|---|
| `GET` | `/api/v1/tasks` | `TasksController.index` | query `status`, opcional | `200`, lista de `Task` | `401`, `422` |
| `POST` | `/api/v1/tasks` | `TasksController.store` | cuerpo `{ "title" }` | `201`, `Task` | `401`, `422` |
| `GET` | `/api/v1/tasks/:id` | `TasksController.show` | query `today`, obligatorio | `200`, `TaskDetail` | `401`, `404`, `422` |
| `PATCH` | `/api/v1/tasks/:id/status` | `TaskStatusesController.update` | cuerpo `{ "status" }` | `200`, `Task` | `401`, `404`, `422` |
| `PUT` | `/api/v1/tasks/:id/due-date` | `TaskDueDatesController.update` | cuerpo `{ "today", "dueDate" }` | `200`, `TaskDetail` | `401`, `404`, `422` |

- **`Task`** es la tarea de la lista, sin vencimiento, y sale de `TaskTransformer`.
- **`TaskDetail`** añade `dueDate` e `isOverdue`, y sale de `TaskDetailTransformer`.

La forma exacta de cada objeto y de cada error está en el documento OpenAPI que sirve el backend: la interfaz en <http://localhost:3333/api> y el JSON en <http://localhost:3333/api.json>. Sus esquemas están escritos a mano en `backend/app/openapi/schemas.ts` y nada los compara solos con los transformers.

## Reglas de negocio y dónde se aplican

Cada enlace lleva al requisito de la spec, con sus scenarios.

### API

| Requisito | Dónde se aplica |
|---|---|
| [Creación de una tarea con solo el título](../../../openspec/specs/tasks/spec.md#requirement-creación-de-una-tarea-con-solo-el-título) | `createTaskValidator` y `TasksController.store` |
| [Ninguna tarea sin título](../../../openspec/specs/tasks/spec.md#requirement-ninguna-tarea-sin-título) | `createTaskValidator` |
| [Aviso ante un título demasiado largo](../../../openspec/specs/tasks/spec.md#requirement-aviso-ante-un-título-demasiado-largo) | `createTaskValidator` |
| [Una sola lista compartida del espacio](../../../openspec/specs/tasks/spec.md#requirement-una-sola-lista-compartida-del-espacio) | `TasksController.index` y `DEFAULT_LIST_STATUSES` (`app/models/task.ts`) |
| [Lo que cada tarea muestra de su responsable](../../../openspec/specs/tasks/spec.md#requirement-lo-que-cada-tarea-muestra-de-su-responsable) | `TaskAssigneeTransformer` |
| [Tres estados fijos](../../../openspec/specs/tasks/spec.md#requirement-tres-estados-fijos) | `TASK_STATUSES` (`app/models/task.ts`) y `updateTaskStatusValidator` |
| [Cambio de estado de cualquier tarea](../../../openspec/specs/tasks/spec.md#requirement-cambio-de-estado-de-cualquier-tarea) | `TaskStatusesController.update` |
| [Las tareas exigen sesión](../../../openspec/specs/tasks/spec.md#requirement-las-tareas-exigen-sesión) | `.use(middleware.auth())` sobre el grupo `tasks` de `start/routes.ts` |
| [Fecha de vencimiento opcional](../../../openspec/specs/tasks/spec.md#requirement-fecha-de-vencimiento-opcional) | La migración `add_due_date_to_tasks_table`, `createTaskValidator` y `TaskDetailTransformer` |
| [Fijar, cambiar y retirar la fecha de vencimiento](../../../openspec/specs/tasks/spec.md#requirement-fijar-cambiar-y-retirar-la-fecha-de-vencimiento) | `setTaskDueDateValidator` y `TaskDueDatesController.update` |
| [Cuándo una tarea está vencida](../../../openspec/specs/tasks/spec.md#requirement-cuándo-una-tarea-está-vencida) | `Task.isOverdueOn` (`app/models/task.ts`) |
| [El día de referencia lo pone quien mira](../../../openspec/specs/tasks/spec.md#requirement-el-día-de-referencia-lo-pone-quien-mira) | `taskReferenceDayValidator` y `setTaskDueDateValidator` |
| [Consulta de una tarea suelta](../../../openspec/specs/tasks/spec.md#requirement-consulta-de-una-tarea-suelta) | `TasksController.show` |
| [La lista no lleva el vencimiento](../../../openspec/specs/tasks/spec.md#requirement-la-lista-no-lleva-el-vencimiento) | `TaskTransformer`, separado de `TaskDetailTransformer` |
| [Acotar la lista por estado](../../../openspec/specs/tasks/spec.md#requirement-acotar-la-lista-por-estado) | `listTasksValidator` y `TasksController.index` |
| [Un filtro válido sin resultados es una lista vacía legítima](../../../openspec/specs/tasks/spec.md#requirement-un-filtro-válido-sin-resultados-es-una-lista-vacía-legítima) | `TasksController.index` |
| [Un estado que no existe se rechaza, no se responde vacío](../../../openspec/specs/tasks/spec.md#requirement-un-estado-que-no-existe-se-rechaza-no-se-responde-vacío) | `listTasksValidator`. **Hoy no se cumple**: ver [Desviaciones conocidas](#desviaciones-conocidas) |

### Interfaz

| Requisito | Dónde se aplica |
|---|---|
| [Pantalla de la lista del equipo](../../../openspec/specs/tasks/spec.md#requirement-pantalla-de-la-lista-del-equipo) | `src/pages/tasks-page.tsx`, `src/components/task-item.tsx` y `src/routes/protected-route.tsx` |
| [El espacio sin tareas](../../../openspec/specs/tasks/spec.md#requirement-el-espacio-sin-tareas) | `tasks-page.tsx` |
| [Crear una tarea desde la lista](../../../openspec/specs/tasks/spec.md#requirement-crear-una-tarea-desde-la-lista) | `tasks-page.tsx` |
| [Aviso al intentar crear sin un título válido](../../../openspec/specs/tasks/spec.md#requirement-aviso-al-intentar-crear-sin-un-título-válido) | `tasks-page.tsx`, con los `fieldErrors` de `src/lib/api.ts` |
| [Cambiar el estado desde la propia fila](../../../openspec/specs/tasks/spec.md#requirement-cambiar-el-estado-desde-la-propia-fila) | `task-item.tsx` y `tasks-page.tsx` |
| [Una sola vista de tareas, sin señales de presencia](../../../openspec/specs/tasks/spec.md#requirement-una-sola-vista-de-tareas-sin-señales-de-presencia) | `src/routes/app-routes.tsx`, que no declara más vistas de tareas que `/tasks` y `/tasks/:id` |
| [Pantalla de una tarea](../../../openspec/specs/tasks/spec.md#requirement-pantalla-de-una-tarea) | `src/pages/task-page.tsx` |
| [Poner y quitar la fecha desde la pantalla de la tarea](../../../openspec/specs/tasks/spec.md#requirement-poner-y-quitar-la-fecha-desde-la-pantalla-de-la-tarea) | `task-page.tsx` |
| [Aviso ante una fecha que no vale](../../../openspec/specs/tasks/spec.md#requirement-aviso-ante-una-fecha-que-no-vale) | `task-page.tsx` |
| [La señal de tarea vencida](../../../openspec/specs/tasks/spec.md#requirement-la-señal-de-tarea-vencida) | `task-page.tsx`, a partir del `isOverdue` del servidor |
| [No tener fecha no se penaliza](../../../openspec/specs/tasks/spec.md#requirement-no-tener-fecha-no-se-penaliza) | `task-item.tsx` y `task-page.tsx` |
| [El control para acotar la lista](../../../openspec/specs/tasks/spec.md#requirement-el-control-para-acotar-la-lista) | `src/components/task-filter.tsx` |
| [El filtro se pide en la dirección de la lista](../../../openspec/specs/tasks/spec.md#requirement-el-filtro-se-pide-en-la-dirección-de-la-lista) | `tasks-page.tsx`, con `useSearchParams` |
| [Una lista sin filas no significa siempre lo mismo](../../../openspec/specs/tasks/spec.md#requirement-una-lista-sin-filas-no-significa-siempre-lo-mismo) | `tasks-page.tsx` |
| [Lo que sale de la vista no se pierde](../../../openspec/specs/tasks/spec.md#requirement-lo-que-sale-de-la-vista-no-se-pierde) | `tasks-page.tsx` |

Las rutas de backend son relativas a `backend/` y las de interfaz, a `frontend/`. Los validadores están en `backend/app/validators/task.ts`, los transformers en `backend/app/transformers/` y los controladores en `backend/app/controllers/`.

Hay dos cosas escritas dos veces a propósito, y nada comprueba que sigan coincidiendo:
- **`DEFAULT_LIST_STATUSES`** está en `backend/app/models/task.ts` y en `frontend/src/lib/types.ts`.
- **El predicado de la vista por defecto** lo aplica el servidor y lo repite `tasks-page.tsx`, para sacar una fila de la vista al instante.

## Desviaciones conocidas

**Un estado inventado no se rechaza.** Comprobado el 2026-11-10.

- **Qué dice la spec:** el requisito [Un estado que no existe se rechaza, no se responde vacío](../../../openspec/specs/tasks/spec.md#requirement-un-estado-que-no-existe-se-rechaza-no-se-responde-vacío) pide un `422`.
- **Qué hace el código:** desde el commit `8c15707`, `listTasksValidator` declara `status` como `vine.string().optional()`, y `GET /api/v1/tasks?status=archivado` responde `200` con una lista vacía.
- **Qué ve el usuario:** `tasks-page.tsx` solo enseña el aviso de filtro no válido cuando recibe ese `422`. Por eso hoy `/tasks?status=archivado` muestra el mensaje de filtro válido sin resultados («No hay ninguna tarea en «archivado»»). Esto lo deduzco del código; no lo he probado en el navegador.
- **Comentarios que no lo reflejan:** el de `TasksController.index` y el `design.md` del change que añadió el filtro siguen diciendo que el validador corta con un `422`.

## Cómo se prueba en local

### Arrancar

Desde la raíz del repositorio:

```bash
make setup   # solo la primera vez: dependencias, .env, APP_KEY y migraciones
make start   # backend en http://localhost:3333 y frontend en http://localhost:5173
```

La lista está en <http://localhost:5173/tasks> y cada tarea en `/tasks/:id`. Las dos piden sesión; si no tienes cuenta, se crea en `/register`.

### Tests automáticos

```bash
cd backend
npm test                          # toda la suite
node ace test --files=assignee    # solo los de esta capability
```

Hoy solo tiene tests el requisito «Lo que cada tarea muestra de su responsable», en `backend/tests/functional/tasks/assignee.spec.ts`. El resto de la capability se comprueba a mano. La interfaz no puede tener tests todavía, porque el frontend no tiene runner.

Los tests usan el mismo fichero SQLite que el servidor de desarrollo, `backend/tmp/db.sqlite3`. Cada test corre dentro de una transacción global que se deshace al terminar. Si añades uno que escriba, mantén ese aislamiento o ensuciarás tus datos de desarrollo.

### A mano, contra la API

Con el backend arrancado puedes explorar la API en <http://localhost:3333/api>, o llamarla con `curl`. **Estas llamadas escriben en tu base de desarrollo.** Si el email ya está registrado, usa otro o entra con `POST /api/v1/auth/login`.

```bash
API=http://localhost:3333/api/v1
json() { node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).$1"; }

TOKEN=$(curl -s -X POST "$API/auth/signup" -H 'Content-Type: application/json' \
  -d '{"fullName":"Ada Lovelace","email":"ada@example.com","password":"secreto123","passwordConfirmation":"secreto123"}' \
  | json data.token)
AUTH="Authorization: Bearer $TOKEN"

# Crear una tarea y quedarse con su id
ID=$(curl -s -X POST "$API/tasks" -H "$AUTH" -H 'Content-Type: application/json' \
  -d '{"title":"Revisar el informe"}' | json data.id)

curl -s "$API/tasks" -H "$AUTH"                     # vista por defecto
curl -s "$API/tasks?status=done" -H "$AUTH"         # acotada por estado
curl -s "$API/tasks/$ID?today=2026-11-10" -H "$AUTH" # tarea suelta, con vencimiento

curl -s -X PATCH "$API/tasks/$ID/status" -H "$AUTH" -H 'Content-Type: application/json' \
  -d '{"status":"in_progress"}'
curl -s -X PUT "$API/tasks/$ID/due-date" -H "$AUTH" -H 'Content-Type: application/json' \
  -d '{"today":"2026-11-10","dueDate":"2026-11-30"}'
```
