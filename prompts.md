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
/init
```

**Qué salió:** generó `CLAUDE.md` con comandos, contrato del backend y código generado que no se edita.

---

## Prompt 2

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
claude mcp add --transport http --scope project atlassian https://mcp.atlassian.com/v2/mcp
```

**Qué salió:** creó `.mcp.json` con el servidor de Atlassian a nivel de proyecto; faltaba reiniciar y autenticar con `/mcp`.

---

## Prompt 3

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
claude restart
```

**Qué salió:** no funcionó: ese comando no existe; hubo que salir con `/exit` y volver a entrar con `claude --continue`.

---

## Prompt 4

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
/doctor
```

**Qué salió:** todo sano; solo propuso dejar auto mode como modo por defecto y lo apliqué.

---

## Prompt 5

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Agrega al proyecto una skill llamada priority-ticket que debe consultar Jira vía el MCP para localizar y traer el ticket de mayor prioridad asignado al usuario actual con status en «Por hacer», resume sus criterios de aceptación, entra en plan mode y propone cómo implementarlo; una vez que el usuario apruebe el plan se debe mover a «En curso». Ya que se tenga le PR creado siguiendo las reglas en CLAUDE.md se debe mover el ticket a "En revisión" y dejar en los comentarios del ticket el enlace al PR
```

**Qué salió:** creó `.claude/skills/priority-ticket/SKILL.md` a la primera.

---

## Prompt 6

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Agrega al proyecto otra skill llamada commit que realice un commit convencional (tipo(scope): descripción) a partir de los cambios preparados (staged). Se debe usar al cerrar una tarea
```

**Qué salió:** creó `.claude/skills/commit/SKILL.md` a la primera, siguiendo el idioma y los scopes del historial.

---

## Prompt 7

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Crea un sub-agente adversarial-reviewer que debe revisar un pull request intentando romperlo, no aprobarlo, y sin editar nada
```

**Qué salió:** creó `.claude/agents/adversarial-reviewer.md` con herramientas de solo lectura más Bash (el "sin editar" en Bash depende de la regla escrita).

---

## Prompt 8

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Configura un hook que corra el formateador del frontend cada vez que se edite un archivo
```

**Qué salió:** instaló Prettier en `frontend/`, añadió el hook `PostToolUse` y lo probó a mano; funcionó a la primera.

---

## Prompt 9

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
agrega .claude/settings.local.json al .gitignore para que no se incluya
```

**Qué salió:** funcionó a la primera.

---

## Prompt 10

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Agrega "ln -s CLAUDE.md AGENTS.md"
```

**Qué salió:** creó el enlace simbólico `AGENTS.md -> CLAUDE.md`.

---

## Prompt 11

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
susituí todo  el contenido de AGENTS.md por esta línea "ln -s CLAUDE.md AGENTS.md". Esto funciona? Lo que no quiero es tener que estar sincronizando ambos contenidos de CLAUDE.md y AGENTS.md
```

**Qué salió:** no funcionó: al editar el enlace se sobrescribió `CLAUDE.md`; el agente lo restauró desde la conversación.

---

## Prompt 12

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
git add .claude CLAUDE.md AGENTS.md mcp.json
```

**Qué salió:** el agente corrigió `mcp.json` a `.mcp.json` (si no, `git add` fallaba entero) y avisó de los archivos que faltaban.

---

## Prompt 13

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
git add .gitignore frontend/.prettierrc.json frontend/package.json frontend/package-lock.json
```

**Qué salió:** funcionó a la primera.

---

## Prompt 14

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
git commit -m "chore: configura el harness de Claude Code (CLAUDE.md, MCP de Atlassian, skills, subagente revisor y hook de Prettier)"
```

**Qué salió:** commit creado, pero con un autor autogenerado porque Git no tenía identidad configurada.

---

## Prompt 15

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
git config --global user.name "Santiago Germán Capistrán Arroyo"
```

**Qué salió:** funcionó a la primera.

---

## Prompt 16

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
git config --global user.email gcapistran76@gmail.com
```

**Qué salió:** funcionó a la primera.

---

## Prompt 17

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
git commit --amend --reset-author --no-edit
```

**Qué salió:** funcionó a la primera; el commit del harness quedó con mi autoría.

---

## Prompt 18

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Ya cree y me asigné el ticket en Jira. Al finalizar /priority-ticket guarda en prompts.md los prompt de esta sesión
```

**Qué salió:** no funcionó: mi tablero no tenía los estados «Por hacer» ni «En revisión»; la skill se detuvo sin tocar el ticket, como dice su regla.

---

## Prompt 19

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
Ya ajusté el tablero, vuelve a lanzar /priority-ticket
```

**Qué salió:** encontró FLOW-1, resumió los criterios y propuso un plan en plan mode; la sesión se cortó antes de aprobarlo, así que el ticket sigue en «Por hacer».

---

## Prompt 20

**Modelo:** Claude Opus 5.5
**Herramienta:** Claude Code

```
puedes agregar en prompts.md los prompts de la sesión, tomando en cuenta las indicaciones que se tienen indicadas en ese mismo archivo
```

**Qué salió:** generó este archivo.
