import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  if (loading) {
    return <div className="spinner" aria-label="Cargando" />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div>
      <nav>
        <button type="button" onClick={() => setMode('login')}>
          Iniciar sesión
        </button>
        <button type="button" onClick={() => setMode('register')}>
          Registrarse
        </button>
      </nav>
      {mode === 'login' && (
        <LoginForm onForgotPassword={() => setMode('forgot')} />
      )}
      {mode === 'register' && <RegisterForm />}
      {mode === 'forgot' && <ForgotPasswordForm />}
    </div>
  )
}
