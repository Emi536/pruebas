-- Migración para crear la tabla catalogo_juegos
-- Descripción: Catálogo de todos los juegos disponibles.
-- Siempre aplicar: false

-- Habilitar RLS para la tabla
alter table public.catalogo_juegos enable row level security;

create table if not exists public.catalogo_juegos (
  id bigint primary key generated always as identity,
  game_name text,
  label text,
  type text,
  category text,
  created_at timestamptz default now() not null
);

comment on table public.catalogo_juegos is 'Catálogo de todos los juegos disponibles en la plataforma.';

-- Políticas RLS para catalogo_juegos
-- Permitir lectura a todos los usuarios autenticados
drop policy if exists "allow_authenticated_read_catalogo_juegos" on public.catalogo_juegos;
create policy "allow_authenticated_read_catalogo_juegos"
on public.catalogo_juegos
for select
to authenticated
using (true);

-- Permitir modificaciones solo a administradores
drop policy if exists "allow_admin_modification_catalogo_juegos" on public.catalogo_juegos;
create policy "allow_admin_modification_catalogo_juegos"
on public.catalogo_juegos
for all
to authenticated
using (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
)
with check (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
);
