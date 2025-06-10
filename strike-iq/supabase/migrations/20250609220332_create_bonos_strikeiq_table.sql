-- Migración para crear la tabla bonos_strikeiq
-- Descripción: Almacena información sobre los bonos ofrecidos y usados por los jugadores.
-- Siempre aplicar: false

-- Habilitar RLS para la tabla
alter table public.bonos_strikeiq enable row level security;

create table if not exists public.bonos_strikeiq (
  id bigint primary key generated always as identity, -- Cambiado de id_usuario a id autoincremental
  id_usuario_original text, -- Columna para el id_usuario original si es necesario mantenerlo
  usuario text,
  funnel text,
  bonos_ofrecidos numeric,
  bonos_usados numeric,
  monto_total_cargado numeric,
  porcentaje_de_conversion numeric,
  ult_actualizacion timestamp,
  id_casino bigint references public.id_casino (id) on delete set null,
  created_at timestamptz default now() not null
);

comment on table public.bonos_strikeiq is 'Información sobre bonos ofrecidos y utilizados por los jugadores en StrikeIQ.';
comment on column public.bonos_strikeiq.id_casino is 'Casino asociado a estos datos de bonos.';
comment on column public.bonos_strikeiq.id is 'Identificador único para el registro de bono.';
comment on column public.bonos_strikeiq.id_usuario_original is 'ID original del usuario si se necesita referenciar un sistema externo.';


-- Políticas RLS para bonos_strikeiq (similares a historial_jugadores)
drop policy if exists "allow_authenticated_read_bonos_strikeiq" on public.bonos_strikeiq;
create policy "allow_authenticated_read_bonos_strikeiq"
on public.bonos_strikeiq
for select
to authenticated
using (true);

drop policy if exists "allow_admin_data_modification_bonos_strikeiq" on public.bonos_strikeiq;
create policy "allow_admin_data_modification_bonos_strikeiq"
on public.bonos_strikeiq
for all
to authenticated
using (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
)
with check (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
);
