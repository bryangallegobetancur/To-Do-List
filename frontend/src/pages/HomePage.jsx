import { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useTasksStore } from '../store/tasksStore'
import { getTheme, toggleTheme } from '../lib/theme'
import Brand from '../components/ui/Brand'
import Field from '../components/ui/Field'
import {
  CheckIcon,
  ListIcon,
  LogOutIcon,
  MoonIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  SunIcon,
  TrashIcon,
} from '../components/ui/icons'

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'done', label: 'Hechas' },
]

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
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(getTheme() === 'theme-carbon')

  useEffect(() => {
    if (!user) return
    fetchProfile(user.id).catch(() => {})
    fetchTasks(user.id).catch(() => {})
  }, [user, fetchProfile, fetchTasks])

  const filteredTasks = useMemo(() => {
    let list = tasks
    if (filter === 'pending') list = list.filter((task) => !task.completed)
    if (filter === 'done') list = list.filter((task) => task.completed)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (task) =>
          task.title.toLowerCase().includes(q) ||
          (task.description && task.description.toLowerCase().includes(q))
      )
    }
    return list
  }, [tasks, filter, query])

  const completed = tasks.filter((task) => task.completed).length
  const pending = tasks.length - completed
  const progress = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100)

  const greetingName = profile?.name || user?.email || ''
  const displayName = greetingName.split('@')[0]
  const initial = (displayName.charAt(0) || '?').toUpperCase()

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

  function handleToggleTheme() {
    setIsDark(toggleTheme() === 'theme-carbon')
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <Brand />
        <nav className="sidebar__nav" aria-label="Navegación">
          <span className="sidebar__item sidebar__item--active">
            <ListIcon />
            Mis tareas
          </span>
        </nav>
        <div className="sidebar__footer">
          <button
            type="button"
            className="btn btn--ghost btn--block"
            onClick={handleSignOut}
          >
            <LogOutIcon />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="app__body">
        <header className="topbar">
          <span className="topbar__brand">
            <Brand />
          </span>
          <div className="topbar__search">
            <Field
              id="search"
              type="search"
              placeholder="Buscar tareas…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Buscar tareas"
              icon={<SearchIcon />}
            />
          </div>
          <div className="topbar__actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={handleToggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <span className="avatar" aria-hidden="true">
              {initial}
            </span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleSignOut}
            >
              Salir
            </button>
          </div>
        </header>

        <main className="main">
          <header className="header">
            <h1 className="header__greeting">Hola, {displayName}</h1>
            <p className="header__sub">
              {tasks.length === 0
                ? 'Empieza a organizar tu día.'
                : `${pending} pendientes · ${completed} completadas`}
            </p>
          </header>

          {tasks.length > 0 && (
            <>
              <div className="metrics">
                <div className="metric">
                  <span className="metric__value metric__value--accent">{completed}</span>
                  <span className="metric__label">Completadas</span>
                </div>
                <div className="metric">
                  <span className="metric__value">{pending}</span>
                  <span className="metric__label">Pendientes</span>
                </div>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Progreso general"
              >
                <div className="progress__bar" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}

          <form className="task-form" onSubmit={handleSubmit}>
            <Field
              className="field--grow"
              id="new-task-title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="¿Qué necesitas hacer?"
              aria-label="Título de la nueva tarea"
              required
            />
            <Field
              className="field--grow"
              id="new-task-description"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descripción (opcional)"
              aria-label="Descripción de la nueva tarea"
            />
            <button type="submit" className="btn btn--primary">
              <PlusIcon />
              Añadir
            </button>
          </form>

          {error && (
            <span className="field__error" role="alert">
              {error}
            </span>
          )}

          <div className="filters" role="group" aria-label="Filtrar tareas">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`chip ${filter === f.key ? 'chip--active' : ''}`}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner" aria-label="Cargando" />
          ) : filteredTasks.length === 0 ? (
            <div className="empty">
              <span className="empty__icon" aria-hidden="true">
                <ListIcon />
              </span>
              <h2 className="empty__title">
                {tasks.length === 0
                  ? 'Aún no hay tareas'
                  : 'Sin resultados'}
              </h2>
              <p className="empty__text">
                {tasks.length === 0
                  ? 'Empieza por la primera: escribe algo en el campo de arriba y pulsa Añadir.'
                  : 'Prueba con otro término o cambia el filtro.'}
              </p>
            </div>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li key={task.id}>
                  <div className="task-row">
                    <button
                      type="button"
                      className={`task-row__check ${task.completed ? 'task-row__check--done' : ''}`}
                      onClick={() => toggleTask(task.id, !task.completed)}
                      aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
                      aria-pressed={task.completed}
                    >
                      {task.completed && <CheckIcon />}
                    </button>
                    <div className="task-row__body">
                      <span className={`task-row__title ${task.completed ? 'task-row__title--done' : ''}`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="task-row__meta">{task.description}</span>
                      )}
                    </div>
                    <div className="task-row__actions">
                      <button
                        type="button"
                        className="task-row__action"
                        aria-label={`Editar ${task.title}`}
                        title="Editar"
                        onClick={() => {
                          setTitle(task.title)
                          setDescription(task.description || '')
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        className="task-row__action task-row__action--delete"
                        aria-label={`Eliminar ${task.title}`}
                        title="Eliminar"
                        onClick={() => deleteTask(task.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  )
}
