create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text default '',
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "Usuarios pueden leer sus propias tareas"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus propias tareas"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus propias tareas"
  on public.tasks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Usuarios pueden eliminar sus propias tareas"
  on public.tasks for delete
  using (auth.uid() = user_id);

create index if not exists tasks_user_id_idx on public.tasks (user_id);
