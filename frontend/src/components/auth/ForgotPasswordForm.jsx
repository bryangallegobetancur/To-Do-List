import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import Field from '../ui/Field'
import { MailIcon } from '../ui/icons'

const RESEND_DELAY = 30

export default function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef(null)
  const resetPassword = useAuthStore((state) => state.resetPassword)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  function startCountdown() {
    setSeconds(RESEND_DELAY)
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      startCountdown()
    } catch (err) {
      setError(err.message || 'No se pudo enviar el enlace')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (seconds > 0) return
    setError('')
    try {
      await resetPassword(email)
      startCountdown()
    } catch (err) {
      setError(err.message || 'No se pudo enviar el enlace')
    }
  }

  if (sent) {
    return (
      <div className="auth__confirm">
        <span className="auth__confirm-icon" aria-hidden="true">
          <MailIcon />
        </span>
        <h2 className="auth__confirm-title">Revisa tu correo</h2>
        <p className="auth__confirm-text">
          Enviamos un enlace para restablecer tu contraseña a {email}.
        </p>
        <div className="auth__resend">
          <span>¿No lo recibiste?</span>
          <button
            type="button"
            className="auth__back"
            onClick={handleResend}
            disabled={seconds > 0}
          >
            {seconds > 0
              ? `Reenviar en 00:${String(seconds).padStart(2, '0')}`
              : 'Reenviar'}
          </button>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onBack}>
          Volver a iniciar sesión
        </button>
      </div>
    )
  }

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <h2 className="auth__title">Recupera tu acceso</h2>
      <p className="auth__subtitle">
        Te enviaremos un enlace para restablecer tu contraseña.
      </p>

      <Field
        label="Email"
        id="forgot-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="tucorreo@ejemplo.com"
        autoComplete="email"
        required
      />

      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
        {loading ? 'Enviando…' : 'Enviar enlace'}
      </button>

      <button type="button" className="btn btn--ghost" onClick={onBack}>
        Volver a iniciar sesión
      </button>
    </form>
  )
}
