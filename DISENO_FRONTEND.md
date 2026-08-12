# DISEÑO FRONTEND — To-Do List

Sistema visual definitivo basado en dos muestras aprobadas:

- **Modo oscuro → Muestra 02 “Carbón & Brasa”**
- **Modo claro → Muestra 05 “Marino”**

Ambos modos comparten la misma estructura de componentes y los mismos nombres de tokens; solo cambian los valores. Cambiar de modo = cambiar una clase (`theme-carbon` / `theme-marino`) en `<html>`.

---

## 1. Principios

1. Sobriedad profesional: nada de gradientes morados, glassmorphism ni confeti.
2. Jerarquía por tipografía y espacio, no por color saturado.
3. Un solo color de acento por modo; el resto es neutro.
4. Densidad media: la lista de tareas es el protagonista.
5. Accesibilidad: contraste AA mínimo, foco visible siempre (`--ring`), targets ≥ 40 px.

---

## 2. Tokens de diseño

Todos los tokens son variables CSS en `src/styles.css`, consumidas vía Tailwind (`bg-background`, `text-muted-foreground`, etc.). **Nunca** usar colores literales (`text-white`, `bg-[#000]`) en componentes.

### 2.1 Modo oscuro — Carbón & Brasa (`.theme-carbon`)

| Token | Valor | Uso |
|---|---|---|
| `--display-font` | Space Grotesk | Títulos, números, marca |
| `--body-font` | DM Sans | Texto, formularios |
| `--radius` | 0.5rem | Bordes contenidos, técnicos |
| `--background` | `oklch(0.19 0.004 60)` | Fondo app |
| `--foreground` | `oklch(0.95 0.004 80)` | Texto principal |
| `--card` | `oklch(0.24 0.005 60)` | Tarjetas, filas de tarea |
| `--primary` | `oklch(0.68 0.17 41)` | Ámbar brasa: CTA, foco, progreso |
| `--primary-foreground` | `oklch(0.16 0.01 40)` | Texto sobre ámbar |
| `--secondary` | `oklch(0.3 0.005 60)` | Botones secundarios |
| `--muted` / `--muted-foreground` | `oklch(0.28 …)` / `oklch(0.7 …)` | Fondos sutiles / texto secundario |
| `--accent` | `oklch(0.32 0.02 45)` | Estados hover, chips |
| `--border` / `--input` | `oklch(0.35 0.006 60)` | Separadores, campos |
| `--ring` | `oklch(0.68 0.17 41)` | Anillo de foco |
| `--shadow-soft` | `0 18px 40px -24px oklch(0 0 0 / 0.9)` | Elevación de tarjeta |

Carácter: centro de mando. Superficies estratificadas por luminancia (no por sombras fuertes), tipografía compacta y ámbar reservado a la acción principal.

### 2.2 Modo claro — Marino (`.theme-marino`)

| Token | Valor | Uso |
|---|---|---|
| `--display-font` | Urbanist | Títulos, marca |
| `--body-font` | Epilogue | Texto, formularios |
| `--radius` | 0.75rem | Bordes suaves corporativos |
| `--background` | `oklch(0.98 0.008 240)` | Fondo app (blanco azulado) |
| `--foreground` | `oklch(0.25 0.06 250)` | Texto principal (azul tinta) |
| `--card` | `oklch(1 0 0)` | Tarjetas blancas puras |
| `--primary` | `oklch(0.35 0.09 245)` | Azul marino: CTA, panel lateral |
| `--primary-foreground` | `oklch(0.98 0.008 240)` | Texto sobre marino |
| `--secondary` | `oklch(0.94 0.02 230)` | Botones secundarios |
| `--muted` / `--muted-foreground` | `oklch(0.95 …)` / `oklch(0.52 …)` | Fondos sutiles / texto secundario |
| `--accent` | `oklch(0.72 0.09 205)` | Cian: foco, subrayados, gráficos |
| `--border` / `--input` | `oklch(0.9 0.015 235)` | Separadores, campos |
| `--ring` | `oklch(0.6 0.09 220)` | Anillo de foco |
| `--shadow-soft` | `0 1px 2px …/0.06, 0 24px 48px -28px …/0.45` | Elevación de tarjeta |

Carácter: SaaS serio. Blanco + marino, cian solo como señal interactiva.

### 2.3 Escalas compartidas

- Espaciado: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px.
- Tipografía: 12 (labels, uppercase tracking-wider), 14 (base UI), 16 (cuerpo), 20–24 (títulos de sección), 30–36 (H1 auth), 40–48 (hero).
- Peso: 400 cuerpo, 500–600 UI, 600–700 display.
- Transiciones: 150 ms para color/opacidad, 200 ms para transform. Sin animaciones decorativas.

---

## 3. Pantallas

### 3.1 Login

- **Oscuro (Carbón):** columna única centrada, máx. 380 px, sobre fondo `background`; tarjeta `card` con borde `border`. Marca arriba (cuadrado ámbar + wordmark en Space Grotesk). Campos con label 12 px uppercase, input `bg-background` + `border-input`, foco `ring-primary`. CTA ámbar full-width. Enlace “¿Olvidaste tu contraseña?” alineado a la derecha del bloque contraseña.
- **Claro (Marino):** pantalla partida 50/50 en ≥ md. Izquierda: formulario (mismo esquema de campos, CTA marino full-width, checkbox “Recordarme”). Derecha: panel `bg-primary` con lema en display 36–40 px y halo radial cian; oculto en móvil.
- Estados: error bajo el campo en `destructive`; botón con spinner y texto “Accediendo…”; deshabilitado al 60 % de opacidad.

### 3.2 Recuperación de contraseña

Flujo de 2 pasos con la misma caja/columna del login:

1. **Solicitar enlace:** título, texto explicativo de una línea, campo correo, CTA “Enviar enlace”, enlace “Volver a iniciar sesión”.
2. **Confirmación:** icono/badge (ámbar en oscuro, cian en claro), mensaje “Revisa tu correo”, correo enmascarado, opción “Reenviar en 00:30”.

Pantalla de **nueva contraseña** (desde el enlace): dos campos, indicador de fuerza en 4 bloques usando `primary`/`muted`, requisitos como lista de checks.

### 3.3 Portal (lista de tareas)

Estructura común:

```text
┌───────────────────────────────────────────────┐
│ Topbar: marca · buscador · avatar · toggle    │
├──────────┬────────────────────────────────────┤
│ Sidebar  │ Header: saludo + contador          │
│ (Marino) │ Filtros: Todas / Pendientes /Hechas│
│          │ Input de nueva tarea               │
│          │ Lista de tareas                    │
└──────────┴────────────────────────────────────┘
```

- **Oscuro (Carbón):** sin sidebar; cabecera con métricas grandes (completadas / pendientes) en display, filtros como chips `secondary` con activo en ámbar, filas de tarea `card` con checkbox cuadrado ámbar, título tachado + `muted-foreground` al completarse, acciones (editar/eliminar) visibles en hover/foco.
- **Claro (Marino):** sidebar fija 240 px `bg-card` con borde derecho, ítem activo con fondo `secondary` y barra `accent` de 2 px a la izquierda; contenido máx. 780 px; barra de progreso `accent`; filas separadas por `border` sin sombra.
- **Vacío:** ilustración tipográfica + “Aún no hay tareas. Empieza por la primera.” + CTA.
- **Responsive:** < 768 px sidebar → barra inferior de 4 ítems; panel derecho de login se oculta; padding lateral 16 px.

---

## 4. Componentes base

| Componente | Reglas |
|---|---|
| `Button` | `primary` (sólido), `secondary`, `ghost`, `destructive`. Altura 40/44 px, `rounded-[var(--radius)]`, foco `ring-2 ring-ring`. |
| `Input` | Label externo 12 px uppercase, borde `input`, foco borde `accent`/`primary` + ring 2 px, error `destructive`. |
| `Card` | `bg-card` + `border` (+ `shadow-soft` solo en claro). |
| `TaskRow` | Checkbox, título, meta (fecha/etiqueta), acciones en hover. Altura mínima 56 px. |
| `Chip/Filter` | 12–13 px, `secondary` inactivo, `primary` activo. |
| `Toast` | sonner, esquina inferior derecha, tokens del tema. |

---

## 5. Modo oscuro/claro

- Clase en `<html>`: `theme-marino` (claro, por defecto) o `theme-carbon` (oscuro).
- Preferencia inicial: `prefers-color-scheme`; se persiste la elección del usuario.
- Toggle en la topbar (icono sol/luna), transición de color 150 ms.
- El estado del tema se lee tras la hidratación para evitar desajustes de SSR.

---

## 6. Reglas de implementación

1. Solo tokens semánticos en componentes; los valores viven en `src/styles.css`.
2. Fuentes cargadas con `<link>` en `src/routes/__root.tsx` (Space Grotesk, DM Sans, Urbanist, Epilogue).
3. Nada de librerías de UI adicionales: Tailwind + shadcn ya presentes.
4. Cada pantalla contempla los cuatro estados: cargando, vacío, error, con datos.
5. Foco de teclado nunca se elimina; orden de tabulación lógico en formularios.
