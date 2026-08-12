"""MCP Server que expone herramientas para gestionar la To Do List.

Consume la API REST de Flask (app.py) ejecutándose en http://127.0.0.1:5000.
Se ejecuta sobre stdio, ideal para conectar con clientes MCP o asistentes.
"""

import os

import requests
from mcp.server.fastmcp import FastMCP

API_URL = os.environ.get("TODO_API_URL", "http://127.0.0.1:5000")

mcp = FastMCP("todo-list-mcp")


@mcp.tool()
def list_tasks(include_completed: bool = True) -> str:
    """Lista todas las tareas.

    Args:
        include_completed: si False, sólo devuelve las tareas pendientes.

    Returns:
        Una cadena con las tareas y su estado.
    """
    resp = requests.get(
        f"{API_URL}/tasks", params={"completed": str(include_completed).lower()}
    )
    resp.raise_for_status()
    tasks = resp.json()
    if not tasks:
        return "No hay tareas."
    lines = []
    for t in tasks:
        estado = "[x]" if t["completed"] else "[ ]"
        lines.append(f"{t['id']}. {estado} {t['title']} — {t.get('description', '')}")
    return "\n".join(lines)


@mcp.tool()
def create_task(title: str, description: str = "") -> str:
    """Crea una nueva tarea.

    Args:
        title: título de la tarea (obligatorio).
        description: descripción opcional.

    Returns:
        Confirmación con el id de la tarea creada.
    """
    resp = requests.post(
        f"{API_URL}/tasks", json={"title": title, "description": description}
    )
    if resp.status_code != 201:
        return f"Error: {resp.text}"
    task = resp.json()
    return f"Tarea creada: id={task['id']}, título='{task['title']}'"


@mcp.tool()
def get_task(task_id: int) -> str:
    """Obtiene los detalles de una tarea por su id.

    Args:
        task_id: id de la tarea.
    """
    resp = requests.get(f"{API_URL}/tasks/{task_id}")
    if resp.status_code == 404:
        return f"No existe la tarea con id={task_id}."
    resp.raise_for_status()
    t = resp.json()
    estado = "completada" if t["completed"] else "pendiente"
    return (
        f"id={t['id']}\ntítulo={t['title']}\n"
        f"descripción={t.get('description', '')}\nestado={estado}\n"
        f"creada={t.get('created_at', '')}"
    )


@mcp.tool()
def update_task(task_id: int, title: str | None = None, description: str | None = None) -> str:
    """Actualiza el título o la descripción de una tarea.

    Args:
        task_id: id de la tarea.
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
    resp = requests.put(f"{API_URL}/tasks/{task_id}", json=payload)
    if resp.status_code == 404:
        return f"No existe la tarea con id={task_id}."
    if not resp.ok:
        return f"Error: {resp.text}"
    t = resp.json()
    return f"Tarea actualizada: id={t['id']}, título='{t['title']}'"


@mcp.tool()
def complete_task(task_id: int, completed: bool = True) -> str:
    """Marca una tarea como completada o pendiente.

    Args:
        task_id: id de la tarea.
        completed: True para completar, False para reabrir.
    """
    resp = requests.patch(
        f"{API_URL}/tasks/{task_id}/complete", json={"completed": completed}
    )
    if resp.status_code == 404:
        return f"No existe la tarea con id={task_id}."
    if not resp.ok:
        return f"Error: {resp.text}"
    t = resp.json()
    estado = "completada" if t["completed"] else "pendiente"
    return f"Tarea {t['id']} marcada como {estado}."


@mcp.tool()
def delete_task(task_id: int) -> str:
    """Elimina una tarea por su id.

    Args:
        task_id: id de la tarea a eliminar.
    """
    resp = requests.delete(f"{API_URL}/tasks/{task_id}")
    if resp.status_code == 404:
        return f"No existe la tarea con id={task_id}."
    if not resp.ok:
        return f"Error: {resp.text}"
    return f"Tarea {task_id} eliminada."


if __name__ == "__main__":
    mcp.run(transport="stdio")