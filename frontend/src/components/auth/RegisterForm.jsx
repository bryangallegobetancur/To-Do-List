import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import Field from '../ui/Field'
import { MailIcon } from '../ui/icons'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const signUp = useAuthStore((state) => state.signUp)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const result = await signUp(email, password, name)
      if (result.user && result.user.identities && result.user.identities.length === 0) {
        setError('Este correo ya está registrado')
        return
      }
      setSubmittedEmail(email)
    } catch (err) {
      setError(err.message || 'No se pudo registrar')
    } finally {
      setLoading(false)
    }
  }

  if (submittedEmail) {
    return (
      <div className="auth__confirm">
        <span className="auth__confirm-icon" aria-hidden="true">
          <MailIcon />
        </span>
        <h2 className="auth__confirm-title">Revisa tu correo</h2>
        <p className="auth__confirm-text">
          Enviamos un enlace de confirmación a {submittedEmail}.
        </p>
      </div>
    )
  }

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <h2 className="auth__title">Crea tu cuenta</h2>
      <p className="auth__subtitle">Empieza a organizar tus tareas en segundos.</p>

      <Field
        label="Nombre"
        id="register-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Tu nombre"
        autoComplete="name"
        required
      />

      <Field
        label="Email"
        id="register-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tucorreo@ejemplo.com"
        autoComplete="email"
        required
      />

      <Field
        label="Contraseña"
        id="register-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      <Field
        label="Confirmar contraseña"
        id="register-confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        autoComplete="new-password"
        required
      />

      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
        {loading ? 'Registrando…' : 'Registrarse'}
      </button>
    </form>
  )
}
