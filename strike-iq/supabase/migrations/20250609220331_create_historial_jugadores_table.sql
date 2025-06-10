-- Migración para crear la tabla historial_jugadores
-- Descripción: Almacena el historial de actividad de los jugadores en los juegos.
-- Siempre aplicar: false

-- Habilitar RLS para la tabla
alter table public.historial_jugadores enable row level security;

create table if not exists public.historial_jugadores (
  id bigint primary key generated always as identity,
  sesion text,
  usuario text,
  sistema_de_juegos text,
  sello text,
  nombre_del_juego text,
  balance numeric,
  divisa text,
  apuesta numeric,
  ganar numeric,
  ganancias numeric,
  wager numeric,
  "apuesta_añadida" numeric,
  hora_de_apertura timestamp,
  hora_de_cierre timestamp,
  hora_de_ultima_actividad timestamp,
  id_casino bigint references public.id_casino (id) on delete set null,
  created_at timestamptz default now() not null
);

comment on table public.historial_jugadores is 'Historial detallado de las sesiones de juego de los jugadores.';
comment on column public.historial_jugadores.id_casino is 'Casino al que pertenece este historial.';

-- Políticas RLS para historial_jugadores
-- Permitir lectura a usuarios autenticados (potencialmente filtrado por casino si es necesario)
drop policy if exists "allow_authenticated_read_historial_jugadores" on public.historial_jugadores;
create policy "allow_authenticated_read_historial_jugadores"
on public.historial_jugadores
for select
to authenticated
using (true); -- Ajustar si se requiere filtrado por casino_id asociado al usuario

-- Permitir inserción, actualización y eliminación solo a roles de administrador o procesos backend
drop policy if exists "allow_admin_data_modification_historial_jugadores" on public.historial_jugadores;
create policy "allow_admin_data_modification_historial_jugadores"
on public.historial_jugadores
for all
to authenticated
using (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
)
with check (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
);
