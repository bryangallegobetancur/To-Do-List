import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTasksStore } from '../store/tasksStore'

export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const profile = useAuthStore((state) => state.profile)
  const fetchProfile = useAuthStore((state) => state.fetchProfile)
  const signOut = useAuthStore((state) => state.signOut)
  const tasks = useTasksStore((state) => state.tasks)
  const loading = useTasksStore((state) => state.loading)
  const fetchTasks = useTasksStore((state) => state.fetchTasks)
  const createTask = useTasksStore((state) => state.createTask)
  const toggleTask = useTasksStore((state) => state.toggleTask)
  const deleteTask = useTasksStore((state) => state.deleteTask)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    fetchProfile(user.id).catch(() => {})
    fetchTasks(user.id).catch(() => {})
  }, [user, fetchProfile, fetchTasks])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!title.trim()) return
    try {
      await createTask(user.id, title.trim(), description.trim())
      setTitle('')
      setDescription('')
    } catch (err) {
      setError(err.message || 'No se pudo crear la tarea')
    }
  }

  async function handleSignOut() {
    try {
      await signOut()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1>Bienvenido, {profile?.name || user?.email}</h1>
      <button type="button" onClick={handleSignOut}>
        Cerrar sesión
      </button>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="¿Qué necesitas hacer?"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripción (opcional)"
        />
        <button type="submit">Añadir tarea</button>
      </form>

      {error && <p role="alert">{error}</p>}

      {loading ? (
        <div className="spinner" aria-label="Cargando" />
      ) : tasks.length === 0 ? (
        <p>No hay tareas.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id, !task.completed)}
                />
                <span>{task.title}</span>
                {task.description && <span> — {task.description}</span>}
              </label>
              <button type="button" onClick={() => deleteTask(task.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
