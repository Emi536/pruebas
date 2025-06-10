-- Migración para crear la tabla id_casino
-- Descripción: Almacena la información de identificación de los casinos.
-- Siempre aplicar: false

-- Habilitar RLS para la tabla
alter table public.id_casino enable row level security;

create table if not exists public.id_casino (
  id bigint primary key generated always as identity,
  casino_name text not null,
  created_at timestamptz default now() not null
);

comment on table public.id_casino is 'Tabla para almacenar los IDs y nombres de los casinos.';
comment on column public.id_casino.id is 'Identificador único del casino.';
comment on column public.id_casino.casino_name is 'Nombre del casino.';
comment on column public.id_casino.created_at is 'Fecha y hora de creación del registro.';

-- Políticas RLS para id_casino
-- Permitir lectura a usuarios autenticados
drop policy if exists "allow_authenticated_read_id_casino" on public.id_casino;
create policy "allow_authenticated_read_id_casino"
on public.id_casino
for select
to authenticated
using (true);

-- Permitir inserción, actualización y eliminación solo a roles de administrador (ejemplo)
-- Deberás ajustar 'admin_user_role' o la lógica según tu sistema de roles
drop policy if exists "allow_admin_all_id_casino" on public.id_casino;
create policy "allow_admin_all_id_casino"
on public.id_casino
for all
to authenticated
using (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb) -- Asumiendo que tienes un custom claim 'user_role'
  -- O podrías basarte en el email para una configuración simple inicial:
  -- auth.email() like '%@admin.example.com'
)
with check (
  (get_my_claim('user_role'::text) = '"admin"'::jsonb)
  -- auth.email() like '%@admin.example.com'
);
