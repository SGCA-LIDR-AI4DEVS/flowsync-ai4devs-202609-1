import Task from '#models/task'
import { updateTaskStatusValidator } from '#validators/task'
import type { HttpContext } from '@adonisjs/core/http'
import TaskTransformer from '#transformers/task_transformer'
import { ApiResponse } from '@foadonis/openapi/decorators'
import { NotFoundError, TaskResponse, UnauthorizedError, ValidationError } from '#openapi/schemas'

export default class TaskStatusesController {
  /**
   * El estado es lo único mutable de una tarea en este momento, y por eso
   * tiene endpoint propio en vez de colgar de un update genérico: por ese
   * update acabarían colándose el título y el responsable, que son historias
   * que todavía no se han especificado.
   *
   * Cualquier persona con sesión puede cambiar el estado de cualquier tarea,
   * en cualquier dirección. No hay permisos por responsable ni transiciones
   * prohibidas: volver de «hecho» a «pendiente» es justamente lo que arregla
   * un clic dado por error.
   */
  @ApiResponse({
    status: 200,
    description: 'La tarea con el estado ya cambiado.',
    type: TaskResponse,
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
    description: '`status` falta o no es `pending`, `in_progress` ni `done`.',
    type: ValidationError,
  })
  async update({ params, request, serialize }: HttpContext) {
    const task = await Task.findOrFail(params.id)
    const { status } = await request.validateUsing(updateTaskStatusValidator)

    task.status = status
    await task.save()
    await task.load('assignee')

    return serialize(TaskTransformer.transform(task))
  }
}
