---
name: commit
description: Crea un commit convencional (tipo(scope): descripción) a partir de los cambios preparados (staged). Úsala al cerrar una tarea, o cuando el usuario pida commitear o invoque /commit.
---

# /commit

Un único commit convencional con lo que ya está en el área de preparación. Solo lo preparado: no se añade, quita ni modifica nada más.

## 1. Revisar lo preparado

1. Ejecuta `git diff --cached --stat` y `git diff --cached` y resume el cambio.
2. Si no hay nada preparado, **para** y díselo al usuario. No ejecutes `git add` por tu cuenta. Si `git status` muestra cambios sin preparar, menciónalos y deja que el usuario decida qué preparar.
3. Si lo preparado mezcla cambios sin relación (por ejemplo, una funcionalidad y un arreglo ajeno), avisa y propón separarlo en varios commits antes de seguir.
4. Revisa `git log --format=%s -15` para seguir los scopes y el idioma del repo.

## 2. Redactar el mensaje

Formato: `tipo(scope): descripción`

- **tipo**: `feat` (funcionalidad nueva), `fix` (arreglo), `docs`, `style` (formato sin cambio de lógica), `refactor`, `perf`, `test`, `build` (dependencias, build), `ci`, `chore` (mantenimiento, configuración del harness), `revert`.
- **scope**: la parte del proyecto tocada, en minúsculas. Los habituales aquí son `frontend`, `backend` y `harness`; reutiliza los que ya aparezcan en el historial. Si el cambio abarca todo el repo, omite el scope: `tipo: descripción`.
- **descripción**: en español, como el resto del historial. En minúscula, sin punto final, como máximo ~72 caracteres en total en la primera línea. Dice qué cambia, no cómo.
- **cuerpo** (opcional, tras una línea en blanco): el porqué, cuando no sea obvio por el diff. Líneas de ~72 caracteres.
- **cambio incompatible**: `tipo(scope)!: descripción` y un pie `BREAKING CHANGE: <qué se rompe>`.
- Si en la sesión hay un ticket de Jira activo (por ejemplo, traído con `/priority-ticket`), añade el pie `Refs: <CLAVE>`.

Ejemplos:

```
feat(frontend): pantallas de login y registro contra la API de auth
fix(frontend): muestra el error de credenciales inválidas en el login
chore(harness): skill /commit para commits convencionales
```

## 3. Commitear

1. Crea el commit pasando el mensaje con un heredoc, para conservar los saltos de línea:

   ```bash
   git commit -F - <<'EOF'
   tipo(scope): descripción

   Cuerpo opcional.
   EOF
   ```

   Incluye las líneas de atribución que pida el entorno, si las hay.
2. Si un hook de pre-commit falla, corrige la causa, vuelve a preparar los archivos afectados y crea el commit de nuevo. Nunca uses `--no-verify` ni `--amend`.
3. Muestra al usuario el hash y la primera línea (`git log --oneline -1`).

## Reglas

- No hagas `git push` ni crees el PR desde esta skill: eso lo marcan las reglas de proceso de `CLAUDE.md`.
- No modifiques archivos para "mejorar" el commit: se commitea lo que el usuario preparó.
