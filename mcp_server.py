"""MCP Server que gestiona la To Do List usando Supabase.

Usa el service role key de Supabase para operar sobre la tabla `tasks`.
Se ejecuta sobre stdio, ideal para conectar con clientes MCP o asistentes.
"""

import os

from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise SystemExit("Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY")

from mcp.server.fastmcp import FastMCP

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

mcp = FastMCP("todo-list-mcp")


@mcp.tool()
def list_tasks(include_completed: bool = True, user_id: str | None = None) -> str:
    """Lista las tareas.

    Args:
        include_completed: si False, sólo devuelve las tareas pendientes.
        user_id: si se indica, filtra por el usuario (UUID de auth.users).

    Returns:
        Una cadena con las tareas y su estado.
    """
    query = supabase.table("tasks").select("*")
    if user_id:
        query = query.eq("user_id", user_id)
    if not include_completed:
        query = query.eq("completed", False)
    query = query.order("created_at", desc=True)
    resp = query.execute()
    tasks = resp.data
    if not tasks:
        return "No hay tareas."
    lines = []
    for t in tasks:
        estado = "[x]" if t["completed"] else "[ ]"
        lines.append(f"{t['id']}. {estado} {t['title']} — {t.get('description', '')}")
    return "\n".join(lines)


@mcp.tool()
def create_task(title: str, description: str = "", user_id: str | None = None) -> str:
    """Crea una nueva tarea.

    Args:
        title: título de la tarea (obligatorio).
        description: descripción opcional.
        user_id: UUID del usuario dueño de la tarea (obligatorio).

    Returns:
        Confirmación con el id de la tarea creada.
    """
    if not user_id:
        return "Error: se requiere user_id."
    resp = supabase.table("tasks").insert(
        {"title": title, "description": description, "user_id": user_id}
    ).execute()
    task = resp.data[0]
    return f"Tarea creada: id={task['id']}, título='{task['title']}'"


@mcp.tool()
def get_task(task_id: str) -> str:
    """Obtiene los detalles de una tarea por su id.

    Args:
        task_id: id (UUID) de la tarea.
    """
    resp = supabase.table("tasks").select("*").eq("id", task_id).execute()
    if not resp.data:
        return f"No existe la tarea con id={task_id}."
    t = resp.data[0]
    estado = "completada" if t["completed"] else "pendiente"
    return (
        f"id={t['id']}\ntítulo={t['title']}\n"
        f"descripción={t.get('description', '')}\nestado={estado}\n"
        f"creada={t.get('created_at', '')}"
    )


@mcp.tool()
def update_task(task_id: str, title: str | None = None, description: str | None = None) -> str:
    """Actualiza el título o la descripción de una tarea.

    Args:
        task_id: id (UUID) de la tarea.
        title: nuevo título (opcional).
        description: nueva descripción (opcional).
    """
    payload: dict = {}
    if title is not None:
        payload["title"] = title
    if description is not None:
        payload["description"] = description
    if not payload:
        return "No se proporcionaron campos para actualizar."
    resp = supabase.table("tasks").update(payload).eq("id", task_id).execute()
    if not resp.data:
        return f"No existe la tarea con id={task_id}."
    t = resp.data[0]
    return f"Tarea actualizada: id={t['id']}, título='{t['title']}'"


@mcp.tool()
def complete_task(task_id: str, completed: bool = True) -> str:
    """Marca una tarea como completada o pendiente.

    Args:
        task_id: id (UUID) de la tarea.
        completed: True para completar, False para reabrir.
    """
    resp = (
        supabase.table("tasks")
        .update({"completed": completed})
        .eq("id", task_id)
        .execute()
    )
    if not resp.data:
        return f"No existe la tarea con id={task_id}."
    t = resp.data[0]
    estado = "completada" if t["completed"] else "pendiente"
    return f"Tarea {t['id']} marcada como {estado}."


@mcp.tool()
def delete_task(task_id: str) -> str:
    """Elimina una tarea por su id.

    Args:
        task_id: id (UUID) de la tarea a eliminar.
    """
    resp = supabase.table("tasks").delete().eq("id", task_id).execute()
    if not resp.data:
        return f"No existe la tarea con id={task_id}."
    return f"Tarea {task_id} eliminada."


if __name__ == "__main__":
    mcp.run(transport="stdio")
