"""Capa de acceso a datos para la To Do List usando SQLite."""

import sqlite3
from contextlib import contextmanager
from pathlib import Path

DB_PATH = Path(__file__).parent / "tasks.db"


def init_db() -> None:
    """Crea la tabla de tareas si no existe."""
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT DEFAULT '',
                completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )


@contextmanager
def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def create_task(title: str, description: str = "") -> dict:
    with get_connection() as conn:
        cur = conn.execute(
            "INSERT INTO tasks (title, description) VALUES (?, ?)",
            (title, description),
        )
        row = conn.execute(
            "SELECT * FROM tasks WHERE id = ?", (cur.lastrowid,)
        ).fetchone()
        return dict(row)


def get_task(task_id: int) -> dict | None:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM tasks WHERE id = ?", (task_id,)).fetchone()
        return dict(row) if row else None


def list_tasks(include_completed: bool = True) -> list[dict]:
    with get_connection() as conn:
        if include_completed:
            rows = conn.execute("SELECT * FROM tasks ORDER BY id").fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM tasks WHERE completed = 0 ORDER BY id"
            ).fetchall()
        return [dict(r) for r in rows]


def update_task(task_id: int, title: str | None = None, description: str | None = None) -> dict | None:
    task = get_task(task_id)
    if not task:
        return None
    new_title = title if title is not None else task["title"]
    new_desc = description if description is not None else task["description"]
    with get_connection() as conn:
        conn.execute(
            "UPDATE tasks SET title = ?, description = ? WHERE id = ?",
            (new_title, new_desc, task_id),
        )
    return get_task(task_id)


def complete_task(task_id: int, completed: bool = True) -> dict | None:
    with get_connection() as conn:
        cur = conn.execute(
            "UPDATE tasks SET completed = ? WHERE id = ?",
            (1 if completed else 0, task_id),
        )
        if cur.rowcount == 0:
            return None
    return get_task(task_id)


def delete_task(task_id: int) -> bool:
    with get_connection() as conn:
        cur = conn.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        return cur.rowcount > 0


def _bool_to_int(task: dict) -> dict:
    task["completed"] = bool(task["completed"])
    return task


init_db()