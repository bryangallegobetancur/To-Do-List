import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

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
      <div>
        <p>Revisa tu correo para confirmar tu cuenta.</p>
        <p>Enviamos un enlace de confirmación a {submittedEmail}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="register-name">Nombre</label>
      <input
        id="register-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label htmlFor="register-email">Email</label>
      <input
        id="register-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="register-password">Contraseña</label>
      <input
        id="register-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <label htmlFor="register-confirm-password">Confirmar contraseña</label>
      <input
        id="register-confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  )
}
