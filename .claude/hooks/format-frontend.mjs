#!/usr/bin/env node
// PostToolUse hook: formatea con Prettier cada archivo de frontend/src/** que el agente edita.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8'))
const filePath = input.tool_input?.file_path
if (!filePath) process.exit(0)

const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd
const frontendDir = path.join(projectDir, 'frontend')
const srcDir = path.join(frontendDir, 'src') + path.sep
const absPath = path.resolve(input.cwd || projectDir, filePath)
if (!absPath.startsWith(srcDir) || !existsSync(absPath)) process.exit(0)

const prettier = path.join(frontendDir, 'node_modules', '.bin', 'prettier')
if (!existsSync(prettier)) {
  console.error('format-frontend: Prettier no está instalado; ejecuta `npm install` en frontend/')
  process.exit(1)
}

try {
  execFileSync(prettier, ['--write', '--ignore-unknown', absPath], { cwd: frontendDir, stdio: 'pipe' })
} catch (err) {
  // Exit 2: el error (p. ej. de sintaxis) vuelve al agente para que lo corrija.
  console.error(`format-frontend: Prettier falló en ${path.relative(projectDir, absPath)}\n${err.stderr || err.message}`)
  process.exit(2)
}
