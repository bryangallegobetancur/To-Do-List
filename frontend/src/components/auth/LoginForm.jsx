import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import Field from '../ui/Field'

export default function LoginForm({ onForgotPassword }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const signIn = useAuthStore((state) => state.signIn)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <h2 className="auth__title">Bienvenido de nuevo</h2>
      <p className="auth__subtitle">Inicia sesión para ver tus tareas.</p>

      <Field
        label="Email"
        id="login-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tucorreo@ejemplo.com"
        autoComplete="email"
        required
      />

      <div className="field">
        <div className="field__label-row">
          <label className="field__label" htmlFor="login-password">
            Contraseña
          </label>
          <button
            type="button"
            className="auth__forgot"
            onClick={onForgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <input
          id="login-password"
          className="field__input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <label className="field field--row">
        <input
          type="checkbox"
          checked={remember}
          onChange={(event) => setRemember(event.target.checked)}
        />
        <span className="field__row-label">Recordarme</span>
      </label>

      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
        {loading ? 'Accediendo…' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
