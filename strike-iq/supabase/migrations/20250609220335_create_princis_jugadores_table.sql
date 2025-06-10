-- Migración para crear la tabla princis_jugadores
-- Descripción: Almacena datos principales o específicos de jugadores (estructura amplia).
-- Siempre aplicar: false

-- Habilitar RLS para la tabla
alter table public.princis_jugadores enable row level security;

create table if not exists public.princis_jugadores (
  id bigint primary key generated always as identity,
  princi_1 text, princi_2 text, princi_3 text, princi_4 text, princi_5 text,
  princi_6 text, princi_7 text, princi_8 text, princi_9 text, princi_10 text,
  princi_11 text, princi_12 text, princi_13 text, princi_14 text, princi_15 text,
  princi_16 text, princi_17 text, princi_18 text, princi_19 text, princi_20 text,
  princi_21 text, princi_22 text, princi_23 text, princi_24 text, princi_25 text,
  princi_26 text, princi_27 text, princi_28 text, princi_29 text, princi_30 text,
  princi_31 text, princi_32 text, princi_33 text, princi_34 text, princi_35 text,
  princi_36 text, princi_37 text, princi_38 text, princi_39 text, princi_40 text,
  princi_41 text, princi_42 text, princi_43 text, princi_44 text, princi_45 text,
  princi_46 text, princi_47 text, princi_48 text, princi_49 text, princi_50 text,
  princi_51 text, princi_52 text,
  id_casino bigint references public.id_casino (id) on delete set null,
  created_at timestamptz default now() not null
);

comment on table public.princis_jugadores is 'Tabla para datos principales o específicos de jugadores, con una estructura flexible de múltiples columnas.';
comment on column public.princis_jugadores.id_casino is 'Casino asociado a estos datos de jugadores.';

-- Políticas RLS para princis_jugadores (similares a historial_jugadores)
drop policy if exists "allow_authenticated_read_princis_jugadores" on public.princis_jugadores;
create policy "allow_authenticated_read_princis_jugadores"
on public.princis_jugadores
for select
to authenticated
using (true);

drop policy if exists "allow_admin_data_modification_princis_jugadores" on public.princis_jugadores;
create policy "allow_admin_data_modification_princis_jugadores"
on public.princis_jugadores
for all
to authenticated
using (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
)
with check (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
);
