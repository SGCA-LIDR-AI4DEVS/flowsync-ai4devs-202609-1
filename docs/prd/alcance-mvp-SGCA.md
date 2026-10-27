# Alcance del MVP de FlowSync

Alcance consensuado, base del futuro PRD. Es un documento de producto: no incluye modelo de datos, endpoints ni arquitectura.

## 1. Problema

En equipos remotos pequeños nadie ve el estado del equipo sin interrumpir a alguien. Se nota en tres cosas:

- la mitad de la daily se va en la ronda de "¿en qué estás?";
- hay preguntas constantes por Slack o por chat;
- se duplica trabajo. Episodio real: dos personas tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera, y se perdieron dos días.

## 2. Usuarios

- **Quiénes:** equipos remotos de 3 a 10 personas, con roles planos, que se coordinan entre pares. El valor lo cobran los pares, no un lead: no hay reporte hacia arriba.
- **Primer usuario:** **un caso de estudio, no un cliente real.** Un equipo de 6 personas de producto SaaS repartido en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada.
- **Quién no:** un equipo que necesite sprints, estimaciones, informes o permisos.

## 3. Propuesta de valor

**Tu cola de trabajo y el estado del equipo son la misma lista.** Actualizarla cuesta dos clics, sin campos obligatorios más allá del título, y quien la actualiza se beneficia en el momento: decide qué coger y deja de recibir preguntas sobre cómo va. El resto sabe qué está libre y qué está ocupado sin preguntar, y el producto impide empezar algo que ya tiene otra persona.

FlowSync **sustituye** al gestor de tareas actual, no convive con él. **No promete** eliminar la daily: desaparece la ronda de estado, y la parte de bloqueos sigue.

Hipótesis que valida el MVP:

- **H1:** la gente mantiene el estado al día si le cuesta dos clics y la lista es su propia cola de trabajo.
- **H2:** ver ese estado basta para cancelar la ronda de "¿en qué estás?" y para no empezar algo que otro ya tiene.

**Criterio de éxito:** a la semana de uso real, el equipo cancela la ronda de "¿en qué estás?" de la daily y nadie pide que vuelva. Si la siguen haciendo igual, no funcionó.

## 4. Alcance (in)

1. **Espacio único compartido**, sobre el registro y el login que ya existen: cada persona ve todas las tareas.
2. **Crear una tarea en segundos.** El único dato obligatorio es el título.
3. **Coger una tarea libre o soltar una mía.** Una tarea nace sin responsable, y solo puedes ponerte tú en una que esté libre. Puedes soltar las tuyas para que vuelvan a estar libres, pero no puedes asignar ni quitar tareas a otra persona.
4. **Cambiar el estado en dos clics**, con unos pocos estados fijos que no se pueden configurar.
5. **Fecha de vencimiento opcional**, visible junto a cada tarea en la lista. Es una pauta rápida para elegir qué coger: quien mira la lista compara las fechas y coge antes lo que vence antes. El producto solo la muestra, no la interpreta.
6. **Lista compartida que se puede filtrar por estado**, para centrarse en lo pendiente.
7. **Ver los cambios de los demás sin refrescar la página.** Es un resumen que espera, no un aviso que interrumpe.

### Reglas del alcance

- **Quién cambia qué.** El responsable de una tarea solo lo cambia uno mismo: cogerla si está libre o soltarla si es suya. **El título y el estado los puede cambiar cualquiera**, también en tareas cogidas por otra persona, porque los roles son planos. Si dos personas cambian la misma tarea a la vez, se queda el último cambio, sin aviso de conflicto.
- **Tareas atrapadas.** Si alguien se va o deja el equipo con tareas cogidas, nadie más puede liberarlas. **La salida en el MVP es que cualquiera puede cambiar su estado:** se cierra la tarea atrapada y se crea una nueva, libre, para retomar el trabajo. Tiene un límite que se acepta: la tarea cerrada conserva el nombre de su responsable y su estado puede no reflejar lo que pasó de verdad. Si en el caso de estudio pasa a menudo, lo primero que entraría es poder liberar una tarea ajena.

### Supuestos

- **Acceso:** cualquier persona registrada entra en el espacio único, sin invitación. Vale para el caso de estudio, no para producción.
- **Responsable:** una tarea tiene como mucho un responsable.
- **Vencimiento:** la fecha es un día, sin hora, y la puede poner o cambiar cualquiera, igual que el título. Así se evita discutir cuándo vence algo con tres husos horarios. Que sea opcional respeta la regla de que el único campo obligatorio es el título.
- **Riesgo nº 1:** que la información se quede vieja, porque entonces el producto pierde el sentido. Se asume, y la única defensa es que actualizar cueste menos que preguntar, no obligar a nadie.

## 5. NO-alcance (out)

Cada exclusión se justifica por la hipótesis que no ayuda a validar o por la promesa que rompería.

**Lo que toca a quién hace qué**

- **Asignar tareas a otra persona o reasignarlas.** Es trabajo entre pares: cada uno coge lo suyo, nadie reparte. Asignar a otros recrea un papel de responsable que aquí no existe, y el nombre en una tarea dejaría de significar "esta persona está en ello", que es la señal de la que depende H2.
- **Presencia, quién está conectado o indicadores de actividad.** El estado es de la tarea, no de la persona. Medir a la persona es vigilancia, y se rechaza a propósito.
- **Roles y permisos.** Los roles son planos. Una jerarquía añade configuración, que es justo lo que se quiere quitar.
- **Varios equipos o espacios, invitaciones, estar en más de un equipo.** Un espacio único basta para probar H1 y H2 en el caso de estudio. No existe la entidad "equipo".

**Lo que no ayuda a decidir qué coger**

- **Seguimiento de vencimientos:** marcas de "por vencer" o "vencida", avisos o recordatorios, y cualquier otra forma de administrar o seguir plazos. La fecha es una pauta para quien elige qué coger, no una herramienta de control. Interpretarla es seguimiento de estado, y en este producto nadie supervisa a nadie.
- **Resaltar qué ha cambiado desde la última visita.** El caso de llegar por la mañana se cubre viendo el estado actual. Entraría si la gente no detecta los cambios solo con mirar la lista.
- **Borrar o archivar tareas.** Cerrar la tarea con su estado y filtrarla cubre el caso. Borrar abre otra pregunta: qué ve el resto cuando alguien borra algo que otro estaba mirando.
- **Buscar por texto, ordenar a mano o filtrar u ordenar por fecha.** Con 3 a 10 personas basta con el filtro por estado y con ver la fecha junto a cada tarea.

**Lo que vuelve a interrumpir**

- **Notificaciones push o por email.** Vuelven a interrumpir, que es lo que se quiere quitar.
- **Recordatorios para que la gente actualice.** Si se obliga a actualizar, H1 deja de medirse: lo que queremos saber es si la gente actualiza sin que se lo pidan.
- **Comentarios o chat en las tareas.** Recrean Slack dentro del producto. La señal es el estado, no la conversación.
- **Integración con Slack.** Mantiene vivo el canal que queremos vaciar.

**Lo que es otro producto**

- **Sacar el estado de Git, CI o el calendario.** Requiere integraciones y autorización de terceros. H1 consiste en que el estado lo escribe la persona.
- **Importar tareas de otro gestor o convivir con él.** FlowSync lo sustituye: convivir obliga a actualizar dos sitios, y así mueren estas herramientas.
- **Bloqueos y dependencias.** Es la parte de la daily que se mantiene. Prometerlo sería vender de más.

**El "rollo de Jira" al que se renuncia**

- **Sprints, estimaciones, épicas, backlog priorizado, prioridades.** Renuncia explícita: quien los necesita no es nuestro usuario.
- **Estados o campos configurables, subtareas, etiquetas, descripción, adjuntos.** Cada campo de más encarece mantener la lista al día, y ese es el riesgo de H1.
- **Informes, analítica o paneles.** Nadie pide informes. El criterio de éxito se comprueba fuera del producto, preguntando al equipo.
- **App móvil y uso sin conexión.** El caso es abrir la lista en el ordenador, y no cambia el resultado de las hipótesis.

## Parte B: las tres líneas

1. **Los dos números:** la IA propuso 6 cosas dentro del alcance; después de mi recorte quedaron 7.
2. **Tres cosas que deje fuera y porque:** 
**A) Asignar tareas a otra persona o reasignarlas.** Es trabajo entre pares: cada uno coge lo suyo, nadie reparte. Asignar a otros recrea un papel de responsable que aquí no existe, y no ayuda a validar H2. **B) Seguimiento de vencimientos:** marcas de "por vencer" o "vencida", avisos o recordatorios, y cualquier otra forma de administrar o seguir plazos. La fecha es una pauta para quien elige qué coger, no una herramienta de control. No abona para validar H1. **C) Resaltar qué ha cambiado desde la última visita.** Lo que se requiere es conocer el estado al momento no conocer estados de seguimiento. No ayuda para H1.
3. **Exclusión de la que menos seguro estoy:** **Notificaciones push o algún canal para comunicar algo de mi tarea que sea relevante, pueda impactar a alguién más y/o solicitar orientación acerca de mi tarea sin que tenga que interrumpir.** Para que entre habría que identificar si contribuye a acotar los dailys.
