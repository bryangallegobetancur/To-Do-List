# Diseño Actual del Frontend — ToDoList

Este documento describe el estado actual del frontend para que otra IA pueda entender el diseño y proponer/implementar mejoras.

## Stack tecnológico

- **React 18** + **Vite 8** (SPA con `react-router-dom` v6)
- **Estado global**: Zustand (`authStore`, `tasksStore`)
- **Backend**: Supabase (auth + base de datos PostgreSQL)
- **Estilos**: CSS puro, un único archivo global `index.css`. **No hay** framework de UI ni preprocesador.
- **Idioma de la interfaz**: español

## Estructura de archivos

```
frontend/
├── index.html                          # Punto de entrada HTML
├── vite.config.js
├── src/
│   ├── main.jsx                        # Renderiza App con BrowserRouter
│   ├── App.jsx                         # Rutas: /login y / (protegida)
│   ├── index.css                       # TODO el CSS global (solo ~18 líneas)
│   ├── lib/supabase.js                 # Cliente Supabase
│   ├── store/
│   │   ├── authStore.js                # user, profile, signIn, signUp, signOut, resetPassword, fetchProfile
│   │   └── tasksStore.js               # tasks, loading, fetchTasks, createTask, toggleTask, deleteTask
│   ├── pages/
│   │   ├── LoginPage.jsx               # Página de autenticación con 3 modos
│   │   └── HomePage.jsx                # Dashboard con lista de tareas
│   └── components/
│       ├── auth/
│       │   ├── LoginForm.jsx
│       │   ├── RegisterForm.jsx
│       │   └── ForgotPasswordForm.jsx
│       └── layout/
│           └── ProtectedRoute.jsx      # Redirige a /login si no hay sesión
```

## Diseño visual actual

### Global (`index.css`)
- **Tipografía**: `font-family: system-ui, sans-serif` (sin Google Fonts ni fuentes personalizadas).
- **Unico componente estilizado**: un `.spinner` de carga (borde gris `#ccc`, parte superior oscura `#333`, animación de giro CSS).
- **Sin paleta de colores**: no se definen variables CSS de colores. Todo lo demás usa los estilos por defecto del navegador.

### LoginPage (página de autenticación)
- Sin fondo, sin tarjeta, sin centrado. El contenido va pegado arriba a la izquierda.
- Barra de navegación con dos botones planos: "Iniciar sesión" y "Registrarse" (cambia el `mode` por estado local).
- Tres modos con `useState`: `login`, `register`, `forgot`.
- Muestra un spinner centrado mientras `loading` es true.

### Formularios de autenticación (LoginForm, RegisterForm, ForgotPasswordForm)
- Layout vertical: `<label>` + `<input>` por campo, sin agrupar visualmente.
- Inputs y botones con estilos nativos del navegador.
- Mensajes de error en un `<p role="alert">` sin estilo.
- Botones con texto de estado ("Iniciando sesión...", "Registrando...", "Enviando...") y `disabled` durante carga.
- Login: email + contraseña + enlace "¿Olvidaste tu contraseña?".
- Register: nombre, email, contraseña, confirmar contraseña; valida que coincidan; muestra pantalla de "revisa tu correo".
- Forgot: solo email + pantalla de confirmación.

### HomePage (dashboard de tareas)
- Encabezado plano: `<h1>` "Bienvenido, {nombre}" + botón "Cerrar sesión".
- Formulario de nueva tarea: input de título + input de descripción + botón "Añadir tarea".
- Lista de tareas en `<ul>`:
  - Checkbox + título + descripción en línea.
  - Botón "Eliminar" por tarea.
- Estados: spinner mientras carga, texto "No hay tareas." si está vacía, mensaje de error si falla la creación.
- Sin estilos: elementos listados pegados, sin contenedor, sin sombras, sin espaciado intencional.

## Funcionalidad existente (a preservar al rediseñar)

1. **Auth con Supabase**: registro con confirmación por email, login, logout, reset de contraseña.
2. **Rutas protegidas**: `/` redirige a `/login` si no hay sesión.
3. **CRUD de tareas por usuario**: crear, listar, marcar como completada (toggle) y eliminar. Cada tarea: `id`, `title`, `description`, `completed`, `user_id`.
4. **Bienvenida personalizada**: muestra `profile.name` o el email si no hay perfil.

## Puntos débiles / oportunidades de mejora (sugerencias para la otra IA)

- No hay diseño visual: es HTML por defecto del navegador.
- No hay responsividad / layout centrado / contenedor con ancho máximo.
- No hay paleta de colores, tipografía de marca ni tema (claro/oscuro).
- No hay componentes reutilizables (Input, Button, Card, Badge, Modal).
- No hay estados vacíos, skeleton loaders ni animaciones de transición.
- Accesibilidad básica: hay `role="alert"`, labels y `aria-label` en spinner, pero faltan focus states, skip links y contraste definido.
- No hay feedback visual de éxito (toast) ni confirmación antes de eliminar.
- Las tareas no tienen fecha de creación, prioridad ni edición.
- No hay filtros/búsqueda/ordenación de tareas.
- No hay página de perfil.

## Datos de las tablas (para contexto del rediseño)

- `profiles(id uuid pk references auth.users, name text, email text)`
- `tasks(id uuid pk, user_id uuid references auth.users, title text not null, description text, completed boolean default false, created_at timestamptz default now())`
