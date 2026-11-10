import Task from '#models/task'
import { setTaskDueDateValidator, toCalendarDay } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'
import TaskDetailTransformer from '#transformers/task_detail_transformer'
import { ApiResponse } from '@foadonis/openapi/decorators'
import {
  NotFoundError,
  TaskDetailResponse,
  UnauthorizedError,
  ValidationError,
} from '#openapi/schemas'

export default class TaskDueDatesController {
  /**
   * Fijar, cambiar y retirar la fecha de vencimiento son la misma operación, y
   * por eso comparten endpoint: quitar la fecha no es borrar un recurso, es
   * poner el valor «sin fecha», que es un valor legítimo del campo.
   *
   * Endpoint propio en vez de un update genérico de la tarea, por el mismo
   * motivo que el estado: por ahí se colarían el título y el responsable, que
   * este change no permite tocar.
   *
   * Cualquiera con sesión puede cambiar la fecha de cualquier tarea, igual que
   * el estado. No se comprueba quién es el responsable.
   */
  @ApiResponse({
    status: 200,
    description: 'La tarea con la fecha ya fijada o retirada, y su vencimiento resuelto.',
    type: TaskDetailResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Sin token o con un token no válido.',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: 404,
    description: 'No existe ninguna tarea con ese id.',
    type: NotFoundError,
  })
  @ApiResponse({
    status: 422,
    description: 'Falta `today` o `dueDate`, o alguno no es un día `AAAA-MM-DD` válido.',
    type: ValidationError,
  })
  async update({ params, request, serialize }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    const { today, dueDate } = await request.validateUsing(setTaskDueDateValidator)

    // El `DateTime` del validador se queda aquí: hacia dentro, una fecha de
    // vencimiento es un día en texto y nunca un instante.
    task.dueDate = dueDate === null ? null : toCalendarDay(dueDate)
    await task.save()
    await task.load('assignee')

    // Se devuelve ya resuelta contra el día de quien pide, para que aplazar una
    // tarea vencida deje de mostrarla vencida en esta misma respuesta.
    return serialize(TaskDetailTransformer.transform(task, toCalendarDay(today)))
  }
}
