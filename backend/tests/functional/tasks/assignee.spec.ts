import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: el responsable se identifica por su nombre y
 * sus iniciales, la tarea no filtra datos de su cuenta, y un responsable sin
 * nombre sigue llegando con iniciales.
 *
 * El requisito habla de «cada tarea» y el segundo scenario de «cualquier tarea,
 * suelta o dentro de la lista», así que cada test mira el `assignee` en todas
 * las respuestas de la API que devuelven una tarea, no solo en una: al crearla,
 * en la lista, suelta, al cambiarle el estado y al fijarle la fecha. Cada test
 * compara todas a la vez en una sola aserción, para que un fallo diga de golpe
 * en cuáles se incumple y no solo en la primera que encuentre.
 *
 * Quien crea la tarea es su responsable (la creación no admite otro), pero quien
 * la lee y la modifica después es otra cuenta: lo que se comprueba es lo que el
 * resto del equipo ve de esa persona.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const PASSWORD = 'secreto123'

  // La tarea suelta y el cambio de fecha exigen el día de quien mira; el valor
  // no influye en nada de lo que aquí se comprueba.
  const TODAY = '2026-11-09'

  type Assignee = Record<string, unknown>
  type PorRespuesta<T> = Record<string, T>

  async function sesion(client: any, fullName: string | null, email: string) {
    await User.create({ fullName, email, password: PASSWORD })

    const response = await client.post('/api/v1/auth/login').json({ email, password: PASSWORD })

    return response.body().data.token as string
  }

  /**
   * El `assignee` de una misma tarea en cada respuesta que la devuelve,
   * indexado por la operación que lo trajo.
   */
  async function assigneeEnCadaRespuesta(
    client: any,
    assert: any,
    responsable: { fullName: string | null; email: string }
  ): Promise<PorRespuesta<Assignee>> {
    const suyo = await sesion(client, responsable.fullName, responsable.email)
    const otro = await sesion(client, 'Alan Turing', 'alan@example.com')

    const creada = await client
      .post('/api/v1/tasks')
      .header('Authorization', `Bearer ${suyo}`)
      .json({ title: 'Revisar el informe' })
    creada.assertStatus(201)

    const id = creada.body().data.id

    const lista = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${otro}`)
    lista.assertStatus(200)

    const suelta = await client
      .get(`/api/v1/tasks/${id}`)
      .qs({ today: TODAY })
      .header('Authorization', `Bearer ${otro}`)
    suelta.assertStatus(200)

    const estado = await client
      .patch(`/api/v1/tasks/${id}/status`)
      .header('Authorization', `Bearer ${otro}`)
      .json({ status: 'in_progress' })
    estado.assertStatus(200)

    const fecha = await client
      .put(`/api/v1/tasks/${id}/due-date`)
      .header('Authorization', `Bearer ${otro}`)
      .json({ today: TODAY, dueDate: '2026-11-30' })
    fecha.assertStatus(200)

    const respuestas: PorRespuesta<Assignee> = {
      'POST /tasks': creada.body().data.assignee,
      'GET /tasks': lista.body().data.find((tarea: { id: number }) => tarea.id === id)?.assignee,
      'GET /tasks/:id': suelta.body().data.assignee,
      'PATCH /tasks/:id/status': estado.body().data.assignee,
      'PUT /tasks/:id/due-date': fecha.body().data.assignee,
    }

    // Sin esto, una respuesta que no trajera `assignee` pasaría sin más el test
    // de los datos de acceso: no se filtra nada de lo que no se envía.
    for (const [respuesta, assignee] of Object.entries(respuestas)) {
      assert.isObject(assignee, `${respuesta} no trae el assignee de la tarea`)
    }

    return respuestas
  }

  function cadaUna<T>(respuestas: PorRespuesta<Assignee>, fn: (assignee: Assignee) => T) {
    return Object.fromEntries(
      Object.entries(respuestas).map(([respuesta, assignee]) => [respuesta, fn(assignee)])
    )
  }

  const identificacion = (assignee: Assignee) => ({
    fullName: assignee.fullName,
    initials: assignee.initials,
  })

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const respuestas = await assigneeEnCadaRespuesta(client, assert, {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
    })

    // «AL» es lo que fija para este nombre el requisito «Iniciales de la cuenta»
    // de `openspec/specs/auth/spec.md`.
    assert.deepEqual(
      cadaUna(respuestas, identificacion),
      cadaUna(respuestas, () => ({ fullName: 'Ada Lovelace', initials: 'AL' }))
    )
  })

  test('la tarea no filtra el email ni datos de acceso de su responsable', async ({
    client,
    assert,
  }) => {
    const email = 'ada@example.com'
    const respuestas = await assigneeEnCadaRespuesta(client, assert, {
      fullName: 'Ada Lovelace',
      email,
    })

    // Se busca el valor y no solo el nombre del campo: el email no puede salir
    // tampoco bajo otra clave. Lo mismo con la contraseña, y cualquier campo de
    // contraseña o de token es un dato de acceso aunque no traiga el valor.
    const datosDeAcceso = (assignee: Assignee) => {
      const serializado = JSON.stringify(assignee)

      return [
        ...(serializado.includes(email) ? ['email'] : []),
        ...(serializado.includes(PASSWORD) ? ['contraseña'] : []),
        ...Object.keys(assignee).filter((clave) => /password|token/i.test(clave)),
      ]
    }

    assert.deepEqual(
      cadaUna(respuestas, datosDeAcceso),
      cadaUna(respuestas, () => [])
    )
  })

  test('un responsable sin nombre llega con nombre nulo y con iniciales', async ({
    client,
    assert,
  }) => {
    const respuestas = await assigneeEnCadaRespuesta(client, assert, {
      fullName: null,
      email: 'ada@example.com',
    })

    // «AE» es lo que fija para una cuenta sin nombre con este email el requisito
    // «Iniciales de la cuenta» de `openspec/specs/auth/spec.md`. Y `fullName`
    // tiene que llegar presente y a `null`: que falte la clave no es «nulo».
    assert.deepEqual(
      cadaUna(respuestas, identificacion),
      cadaUna(respuestas, () => ({ fullName: null, initials: 'AE' }))
    )
  })
})
