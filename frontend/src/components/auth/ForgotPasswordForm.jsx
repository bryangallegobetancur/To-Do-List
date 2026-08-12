import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const resetPassword = useAuthStore((state) => state.resetPassword)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message || 'No se pudo enviar el enlace')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div>
        <p>Revisa tu correo.</p>
        <p>Enviamos un enlace para restablecer tu contraseña a {email}.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="forgot-email">Email</label>
      <input
        id="forgot-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
      </button>
    </form>
  )
}
