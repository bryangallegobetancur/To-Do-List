# To Do List con MCP

Aplicación de lista de tareas con API REST (Flask), servidor MCP y cliente MCP.

## Instalacion

```bash
pip install -r requirements.txt
```

## Arquitectura

```
                    +-----------+
                    | MCP Client |  (mcp_client.py)
                    +-----+-----+
                          | stdio
                    +-----+-----+
                    | MCP Server |  (mcp_server.py)
                    +-----+-----+
                          | HTTP REST
                    +-----+-----+
                    | Flask API |  (app.py)
                    +-----+-----+
                          |
                    +-----+-----+
                    |  SQLite   |  (db.py)
                    +-----------+
```

## Uso

### 1. Iniciar la API REST

En una terminal:

```bash
python app.py
```

La API queda disponible en `http://127.0.0.1:5000`.

Endpoints:

| Metodo | Ruta                    | Descripcion                |
|--------|-------------------------|----------------------------|
| GET    | /tasks                  | Listar tareas             |
| POST   | /tasks                  | Crear tarea               |
| GET    | /tasks/<id>             | Obtener tarea             |
| PUT    | /tasks/<id>             | Actualizar tarea          |
| PATCH  | /tasks/<id>/complete    | Completar/desmarcar tarea |
| DELETE | /tasks/<id>             | Eliminar tarea            |
| GET    | /health                 | Health check              |

### 2. Probar el MCP Server directamente

En otra terminal:

```bash
python mcp_server.py
```

Se ejecuta sobre stdio. Escribe un JSON-RPC de prueba o conéctate con el cliente.

### 3. Usar el MCP Client

En otra terminal (con la API corriendo):

```bash
python mcp_client.py
```

Menu interactivo para gestionar tareas usando el protocolo MCP.

### 4. Conectar con un asistente (Claude Desktop, etc.)

Configurar en `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "todolist": {
      "command": "python",
      "args": ["ruta/a/mcp_server.py"]
    }
  }
}
```

## Archivos

| Archivo        | Descripcion                                |
|----------------|--------------------------------------------|
| `app.py`       | API REST con Flask                        |
| `db.py`        | Capa de datos SQLite                      |
| `mcp_server.py`| Servidor MCP que consume la API REST      |
| `mcp_client.py`| Cliente MCP con menu interactivo          |
| `tasks.db`     | Base de datos SQLite (se crea sola)       |
