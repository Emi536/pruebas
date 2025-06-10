-- Migración para crear la tabla jugadores_nuevos
-- Descripción: Almacena información sobre nuevos jugadores registrados.
-- Siempre aplicar: false

-- Habilitar RLS para la tabla
alter table public.jugadores_nuevos enable row level security;

create table if not exists public.jugadores_nuevos (
  id bigint primary key generated always as identity,
  nombre text,
  telefono text,
  sesiones text,
  notas text,
  etiquetas text,
  fecha_ultimo_mensaje date,
  fecha_creacion date,
  id_casino bigint references public.id_casino (id) on delete set null,
  created_at timestamptz default now() not null
);

comment on table public.jugadores_nuevos is 'Información sobre nuevos jugadores registrados en la plataforma.';
comment on column public.jugadores_nuevos.id_casino is 'Casino donde se registró el nuevo jugador.';

-- Políticas RLS para jugadores_nuevos (similares a historial_jugadores)
drop policy if exists "allow_authenticated_read_jugadores_nuevos" on public.jugadores_nuevos;
create policy "allow_authenticated_read_jugadores_nuevos"
on public.jugadores_nuevos
for select
to authenticated
using (true);

drop policy if exists "allow_admin_data_modification_jugadores_nuevos" on public.jugadores_nuevos;
create policy "allow_admin_data_modification_jugadores_nuevos"
on public.jugadores_nuevos
for all
to authenticated
using (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
)
with check (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
);
