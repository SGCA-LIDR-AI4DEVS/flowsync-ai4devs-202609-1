# Arquitectura de FlowSync

Este diagrama muestra los contenedores de FlowSync en el nivel C4: la aplicación web de React que corre en el navegador, la API de AdonisJS a la que llama y la base de datos SQLite en la que la API guarda las cuentas, los tokens de acceso y las tareas. Sale de leer `frontend/src/`, `backend/start/`, `backend/app/`, `backend/config/` y `backend/database/migrations/`. No dibuja ningún entorno de despliegue porque el repositorio no tiene configuración de despliegue: lo que se ve es el montaje local que levanta `make start`. Tampoco aparece el guard de sesión `web`, que está configurado pero no lo usa ninguna ruta: todas las protegidas autentican con access tokens.

```mermaid
C4Container
  title FlowSync · contenedores

  Person(persona, "Persona usuaria", "Se registra, inicia sesión y trabaja sobre la lista compartida de tareas")

  System_Boundary(flowsync, "FlowSync") {
    Container(spa, "Aplicación web", "React 19, Vite 8, react-router", "Pantallas de login, registro, lista de tareas, tarea y perfil. Guarda el token en localStorage y llama a la API solo desde src/lib/api.ts")
    Container(api, "API", "AdonisJS 7, VineJS 4, Auth 10", "Rutas bajo /api/v1 para auth, account y tasks. Los controladores validan con VineJS y responden JSON envuelto en data a través de transformers")
    ContainerDb(db, "Base de datos", "SQLite con better-sqlite3", "Fichero tmp/db.sqlite3 con las tablas users, auth_access_tokens y tasks")
  }

  Rel(persona, spa, "Usa", "Navegador")
  Rel(spa, api, "Llama con fetch", "HTTP, JSON y token Bearer")
  Rel(api, db, "Lee y escribe", "Lucid 22")

  UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```
