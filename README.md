# To Do List — React + Supabase + MCP

To Do List desplegada en **Vercel**, con autenticación y base de datos en **Supabase**, y capa **MCP** para gestionar tareas desde asistentes.

## Arquitectura

```
+----------------------+          +------------------------+
|  React (Vercel SPA)  |  directo |  Supabase              |
|  - auth (Zustand)    |  supabase-js | - auth (login)     |
|  - tareas (RLS)      +----------> | - profiles           |
+----------------------+          | - tasks (por usuario) |
                                  +------------------------+
                                        ^
                                        | service role
                                +-------+-------+
                                | MCP Server    |
                                | (mcp_server)  |
                                +-------+-------+
                                        | stdio
                                 +------+-------+
                                 | MCP Client   |
                                 +--------------+
```

El frontend habla **directo con Supabase** (RLS por usuario). No hay backend propio. Vercel sirve solo el build estático.

## Requisitos

- Node.js 18+
- Python 3.10+
- Proyecto en Supabase (URL + anon key + service role key)
- Cuenta en Vercel

## Setup

### 1. Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. En **SQL Editor**, ejecuta las migraciones en orden:
   - `frontend/supabase/migrations/20260101000000_create_profiles.sql`
   - `frontend/supabase/migrations/20260201000000_create_tasks.sql`
3. En **Authentication → URL Configuration**, pon como `Site URL` tu dominio de Vercel (o `http://localhost:5173` en dev) y configura el redirect.

### 2. Frontend (React)

```bash
cd frontend
npm install
```

Crea `frontend/.env` (guíate por `frontend/.env.example`):

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_SITE_URL=http://localhost:5173
```

Desarrollo:

```bash
npm run dev
```

Build:

```bash
npm run build
```

### 3. Deploy en Vercel

1. Importa el repo en Vercel.
2. En **Root Directory** selecciona `frontend`.
3. Framework: Vite (se detecta automático).
4. En **Environment Variables** añade `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_SITE_URL` (el dominio de producción).
5. Deploy. `frontend/vercel.json` aplica los rewrites SPA.

### 4. MCP

Instala dependencias Python:

```bash
cd mcp
pip install -r requirements.txt
```

Crea un `.env` en `mcp/` (guíate por `.env.example`) con la **service role key**:

```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

Probar el MCP Server directamente (desde la raíz del repo):

```bash
python mcp/mcp_server.py
```

Usar el cliente interactivo (opcional, define `TODO_USER_ID` con tu UUID de `auth.users`):

```bash
python mcp/mcp_client.py
```

Conectar con un asistente (Claude Desktop, etc.) en `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "todolist": {
      "command": "python",
      "args": ["ruta/a/mcp/mcp_server.py"],
      "env": {
        "SUPABASE_URL": "https://tu-proyecto.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "tu-service-role-key"
      }
    }
  }
}
```

## Archivos

| Ruta | Descripción |
|------|-------------|
| `frontend/src/store/authStore.js` | Estado de auth con Zustand |
| `frontend/src/store/tasksStore.js` | CRUD de tareas con Zustand + Supabase |
| `frontend/src/pages/LoginPage.jsx` | Login/registro |
| `frontend/src/components/auth/` | Formularios de login y registro |
| `frontend/src/components/layout/ProtectedRoute.jsx` | Ruta protegida |
| `frontend/supabase/migrations/` | Migraciones SQL (profiles + tasks) |
| `mcp/mcp_server.py` | Servidor MCP sobre Supabase |
| `mcp/mcp_client.py` | Cliente MCP interactivo |
