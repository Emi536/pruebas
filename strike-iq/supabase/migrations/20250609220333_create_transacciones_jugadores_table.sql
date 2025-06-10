-- Migración para crear la tabla transacciones_jugadores
-- Descripción: Registra todas las transacciones financieras de los jugadores.
-- Siempre aplicar: false

-- Habilitar RLS para la tabla
alter table public.transacciones_jugadores enable row level security;

create table if not exists public.transacciones_jugadores (
  id bigint primary key generated always as identity,
  operacion text,
  depositar numeric,
  retirar numeric,
  wager numeric,
  limites numeric,
  balance_antes_de_operacion numeric,
  fecha date,
  tiempo time,
  iniciador text,
  del_usuario text,
  sistema text,
  al_usuario text,
  ip text,
  id_casino bigint references public.id_casino (id) on delete set null,
  created_at timestamptz default now() not null
);

comment on table public.transacciones_jugadores is 'Registro de todas las transacciones financieras de los jugadores.';
comment on column public.transacciones_jugadores.id_casino is 'Casino donde ocurrió la transacción.';

-- Políticas RLS para transacciones_jugadores (similares a historial_jugadores)
drop policy if exists "allow_authenticated_read_transacciones_jugadores" on public.transacciones_jugadores;
create policy "allow_authenticated_read_transacciones_jugadores"
on public.transacciones_jugadores
for select
to authenticated
using (true);

drop policy if exists "allow_admin_data_modification_transacciones_jugadores" on public.transacciones_jugadores;
create policy "allow_admin_data_modification_transacciones_jugadores"
on public.transacciones_jugadores
for all
to authenticated
using (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
)
with check (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
);
