# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Antes de nada, léete el repo y devuélveme el estado real del proyecto: qué capabilities ya existen (auth…) y un diagrama rápido del modelo de datos actual (entidades y relaciones, en Mermaid). No propongas cambios todavía; solo quiero el mapa de lo que hay.
```

## Prompt 2

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Actúa como product partner escéptico. Aquí tienes una idea difusa para FlowSync: «Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización y evitar al máximo el tener que contactar a alguien para preguntar. Algo tipo tareas compartidas pero más en tiempo real y más sencillo y ágil que Jira.» Antes de proponer nada, hazme las 5 preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance. No asumas; pregunta. Ten en cuenta el estado del repo que acabas de mapear (auth; las tareas aún no existen). Una sola ronda: con mis respuestas, continúa sin abrir otra tanda de preguntas. Quédate a nivel de producto: nada de meter el modelo de datos, esquema, estados internos, endpoints ni latencias, eso se decidirá más adelante. Lo que estamos buscando es definir y acotar claramente el problema, usuarios, propuesta de valor,  alcance y exclusiones (no alcances)
```

## Prompt 3

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
-Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
-uién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
-Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
-Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
-Usuarios/equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
-Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real: dilo en voz alta en vez de fingir lo contrario.
-Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
-"Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
-Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
-Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
-Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
-De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas
(Git/PRs,CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
-Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
-Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
-Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
-Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
-"Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
-Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
-Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
-Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
-Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
-Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias.
```

## Prompt 4

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Tomando como base mis respuestas, propón el alcance de un MVP en 5 bloques: problema, usuarios, propuesta de valor, alcance (in) y NO-alcance (out). Sé agresivo recortando: es un MVP, no el producto final. Justifica cada exclusión.
```

## Prompt 5

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Debemos sacar del alcance para el MVP el reasignar una tarea y solo poder asignarme una tarea que este libre y dejar libre una tarea que me haya asignado. Es trabajo entre pares, no tendría porque asignar y/o reasignar tareas a alguien más
```

## Prompt 6

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
De acuerdo dejemos por escrito y muy claros estos 2 puntos permitiendo a cualquiera cambiar título/estado y con esto se puede en el MVP proporcionar un medio para solventar tareas atrapadas
```

**Qué salió:** el agente intentó escribir directamente el documento completo de entrega; rechacé la escritura e interrumpí.

## Prompt 7

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Consolida lo anterior en un alcance final en 5 bloques (problema, usuarios, propuesta de valor, alcance,
NO-alcance), listo para ser la base de un PRD. Guarda ese alcance consensuado en
docs/prd/alcance-mvp.md para que no dependa de la conversación. Todavía no escribas el PRD
```

## Prompt 8

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Lo he analizado mejor y siempre si vamos a agregar la fecha de vencimiento al alcance porque puede servir de pauta rapida para desidir a tomar tomar tareas proximas a vencer antes de otras más lejanas
```

## Prompt 9

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
No vamos a considerar nada referente a manejo/seguimiento de "por vencer" ni nada similar de administración/seguimiento de status
```
