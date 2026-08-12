import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm'
import Brand from '../components/ui/Brand'

export default function LoginPage() {
  const [mode, setMode] = useState('login')
  const user = useAuthStore((state) => state.user)
  const loading = useAuthStore((state) => state.loading)

  if (loading) {
    return (
      <div className="auth">
        <div className="auth__grid">
          <div className="auth__main">
            <div className="spinner" aria-label="Cargando" />
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  const isAuthForm = mode !== 'forgot'

  return (
    <div className="auth">
      <div className="auth__grid">
        <div className="auth__main">
          <div className="auth__box">
            <Brand />
            {isAuthForm && (
              <div className="auth__tabs" role="tablist" aria-label="Autenticación">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  className={`auth__tab ${mode === 'login' ? 'auth__tab--active' : ''}`}
                  onClick={() => setMode('login')}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  className={`auth__tab ${mode === 'register' ? 'auth__tab--active' : ''}`}
                  onClick={() => setMode('register')}
                >
                  Registrarse
                </button>
              </div>
            )}
            <div className="card card--shadow auth__card">
              {mode === 'login' && (
                <LoginForm onForgotPassword={() => setMode('forgot')} />
              )}
              {mode === 'register' && <RegisterForm />}
              {mode === 'forgot' && <ForgotPasswordForm onBack={() => setMode('login')} />}
            </div>
          </div>
        </div>
        <aside className="auth__aside">
          <div className="auth__aside-content">
            <h1 className="auth__aside-title">
              Organiza tu día,
              <br />
              cumple tus metas.
            </h1>
            <p className="auth__aside-text">
              Una lista de tareas simple, rápida y privada para cada proyecto de tu vida.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
