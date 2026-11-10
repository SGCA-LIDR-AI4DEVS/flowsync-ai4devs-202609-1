import { TASK_STATUSES } from '#models/task'
import { ApiProperty, ApiPropertyOptional } from '@foadonis/openapi/decorators'

/**
 * Esquemas del documento OpenAPI que se repiten entre operaciones. El generador
 * publica cada clase en `components.schemas` con su nombre y las respuestas la
 * referencian con `$ref`, así que cada forma se describe una sola vez.
 *
 * Describen lo que el código devuelve hoy, leído de los transformers y de las
 * respuestas reales, no lo que pide la spec. Si un transformer cambia, este
 * fichero tiene que cambiar con él: nada lo comprueba solo.
 */

/** `TaskAssigneeTransformer`. */
export class TaskAssignee {
  @ApiProperty({ type: 'integer' })
  declare id: number

  @ApiProperty({
    type: 'string',
    nullable: true,
    description: 'Nulo si la cuenta no tiene nombre.',
  })
  declare fullName: string | null

  @ApiProperty({
    type: 'string',
    description: 'Dos letras, sacadas del nombre o, si no lo hay, del email.',
  })
  declare initials: string
}

/** `TaskTransformer`: la tarea de la lista, de la creación y del cambio de estado. */
export class Task {
  @ApiProperty({ type: 'integer' })
  declare id: number

  @ApiProperty({ type: 'string' })
  declare title: string

  @ApiProperty({ enum: [...TASK_STATUSES] })
  declare status: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  declare createdAt: string

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  declare updatedAt: string | null

  @ApiProperty({ type: TaskAssignee })
  declare assignee: TaskAssignee
}

/**
 * `TaskDetailTransformer`: la tarea suelta y la respuesta al fijar la fecha.
 * Repite los campos de `Task` en vez de heredarlos para que el esquema publicado
 * no dependa de cómo resuelva la herencia el generador.
 */
export class TaskDetail {
  @ApiProperty({ type: 'integer' })
  declare id: number

  @ApiProperty({ type: 'string' })
  declare title: string

  @ApiProperty({ enum: [...TASK_STATUSES] })
  declare status: string

  @ApiProperty({
    type: 'string',
    format: 'date',
    nullable: true,
    description: 'Día del calendario, `AAAA-MM-DD`. Nulo si la tarea no tiene fecha.',
  })
  declare dueDate: string | null

  @ApiProperty({ type: 'string', format: 'date-time' })
  declare createdAt: string

  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  declare updatedAt: string | null

  @ApiProperty({
    type: 'boolean',
    description: 'Si la tarea está vencida vista desde el día `today` de la petición.',
  })
  declare isOverdue: boolean

  @ApiProperty({ type: TaskAssignee })
  declare assignee: TaskAssignee
}

/** El envoltorio `{ data }` que pone `serialize()` alrededor de una tarea. */
export class TaskResponse {
  @ApiProperty({ type: Task })
  declare data: Task
}

/** El envoltorio `{ data }` de la lista. */
export class TaskListResponse {
  @ApiProperty({ type: [Task] })
  declare data: Task[]
}

/** El envoltorio `{ data }` de la tarea suelta. */
export class TaskDetailResponse {
  @ApiProperty({ type: TaskDetail })
  declare data: TaskDetail
}

/** Un error de VineJS. */
export class ValidationErrorItem {
  @ApiProperty({ type: 'string' })
  declare message: string

  @ApiProperty({ type: 'string', description: 'La regla de VineJS que ha fallado.' })
  declare rule: string

  @ApiProperty({ type: 'string', description: 'El campo que ha fallado.' })
  declare field: string

  @ApiPropertyOptional({
    type: 'object',
    description: 'Datos de la regla, como las opciones válidas de un enum.',
  })
  declare meta?: Record<string, unknown>
}

/** `422`: la petición no pasa el validador. */
export class ValidationError {
  @ApiProperty({ type: [ValidationErrorItem] })
  declare errors: ValidationErrorItem[]
}

/** Un mensaje de error sin campo. */
export class ErrorMessage {
  @ApiProperty({ type: 'string' })
  declare message: string
}

/** `401`: falta el token o no es válido. */
export class UnauthorizedError {
  @ApiProperty({ type: [ErrorMessage] })
  declare errors: ErrorMessage[]
}

/**
 * `404`: la tarea no existe. Fuera de producción el cuerpo trae además la traza
 * del error; `message` es lo único que llega siempre.
 */
export class NotFoundError {
  @ApiProperty({ type: 'string' })
  declare message: string
}
