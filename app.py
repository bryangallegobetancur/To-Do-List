"""API REST para la To Do List con Flask."""

from flask import Flask, jsonify, render_template, request

import db

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


def serialize(task: dict) -> dict:
    return {**task, "completed": bool(task["completed"])}


@app.get("/tasks")
def list_tasks():
    include_completed = request.args.get("completed", "true").lower() == "true"
    return jsonify([serialize(t) for t in db.list_tasks(include_completed)])


@app.post("/tasks")
def create_task():
    data = request.get_json(silent=True) or {}
    title = data.get("title")
    if not title:
        return jsonify({"error": "El campo 'title' es obligatorio"}), 400
    task = db.create_task(title, data.get("description", ""))
    return jsonify(serialize(task)), 201


@app.get("/tasks/<int:task_id>")
def get_task(task_id: int):
    task = db.get_task(task_id)
    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404
    return jsonify(serialize(task))


@app.put("/tasks/<int:task_id>")
def update_task(task_id: int):
    data = request.get_json(silent=True) or {}
    task = db.update_task(
        task_id,
        title=data.get("title"),
        description=data.get("description"),
    )
    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404
    return jsonify(serialize(task))


@app.patch("/tasks/<int:task_id>/complete")
def complete_task(task_id: int):
    data = request.get_json(silent=True) or {}
    completed = data.get("completed", True)
    task = db.complete_task(task_id, completed)
    if not task:
        return jsonify({"error": "Tarea no encontrada"}), 404
    return jsonify(serialize(task))


@app.delete("/tasks/<int:task_id>")
def delete_task(task_id: int):
    if db.delete_task(task_id):
        return "", 204
    return jsonify({"error": "Tarea no encontrada"}), 404


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)